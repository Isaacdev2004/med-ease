import { Injectable } from '@nestjs/common';

import type {
  ChatMessage,
  ClinicalNote,
  ProviderAvailability,
  SaveClinicalNoteInput,
  SendMessageInput,
  SessionListResult,
  SessionRecording,
  SessionTimelineEntry,
  TelemedicineDashboard,
  TelemedicineFilters,
  TelemedicineRepositoryContract,
  TelemedicineSession,
  VideoParticipant,
  WaitingRoomEntry,
} from '@medease/telemedicine-contract';
import {
  normalizePagination,
  PrismaService,
  TenantAwareRepository,
  toPaginatedResult,
} from '@medease/prisma';
import { newId } from '@medease/uuid';

import { RequestContextService } from '../tenant/request-context.service';
import {
  assertSessionFound,
  assertWaitingEntryFound,
  mapTelemedicineRepositoryError,
  toContractPaginated,
} from './telemedicine.helpers';
import {
  getProviderAvailabilityCatalog,
  mapClinicalNote,
  mapMessage,
  mapParticipant,
  mapRecording,
  mapSession,
  mapWaitingEntry,
} from './mappers/telemedicine.mapper';
import { buildSessionWhere } from './queries/telemedicine.queries';

@Injectable()
export class TelemedicineRepository
  extends TenantAwareRepository
  implements TelemedicineRepositoryContract
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {
    super();
  }

  searchSessions(
    filters: TelemedicineFilters = {},
  ): Promise<SessionListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where = buildSessionWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.telemedicineSession.findMany({
          where,
          skip,
          take,
          orderBy: [{ scheduledStart: 'desc' }],
        }),
        tx.telemedicineSession.count({ where }),
      ]);
      return toContractPaginated(
        toPaginatedResult(items.map(mapSession), total, page, pageSize),
      );
    });
  }

  async getSession(sessionId: string): Promise<TelemedicineSession> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.telemedicineSession.findFirst({
        where: { id: sessionId, tenantId: this.tenantId },
      });
      assertSessionFound(row, sessionId);
      return mapSession(row);
    });
  }

  getDashboard(
    patientId?: string,
    clinicianId?: string,
  ): Promise<TelemedicineDashboard> {
    return this.prisma.runInTransaction(async (tx) => {
      const tenantId = this.tenantId;
      const scope: {
        tenantId: string;
        patientId?: string;
        clinicianId?: string;
      } = { tenantId };
      if (patientId) scope.patientId = patientId;
      if (clinicianId) scope.clinicianId = clinicianId;

      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const [
        upcomingSessions,
        activeSessions,
        completedToday,
        waitingRoomCount,
        qualityRows,
        recentRows,
      ] = await Promise.all([
        tx.telemedicineSession.count({
          where: {
            ...scope,
            status: 'scheduled',
            scheduledStart: { gte: now },
          },
        }),
        tx.telemedicineSession.count({
          where: {
            ...scope,
            status: { in: ['in_progress', 'waiting'] },
          },
        }),
        tx.telemedicineSession.count({
          where: {
            ...scope,
            status: 'completed',
            actualEnd: { gte: startOfDay, lte: endOfDay },
          },
        }),
        tx.waitingRoomEntry.count({
          where: {
            tenantId,
            status: 'waiting',
            ...(patientId || clinicianId
              ? {
                  session: {
                    ...(patientId ? { patientId } : {}),
                    ...(clinicianId ? { clinicianId } : {}),
                  },
                }
              : {}),
          },
        }),
        tx.telemedicineSession.findMany({
          where: { ...scope, qualityScore: { not: null } },
          select: { qualityScore: true },
          take: 500,
        }),
        tx.telemedicineSession.findMany({
          where: scope,
          orderBy: { scheduledStart: 'desc' },
          take: 8,
        }),
      ]);

      const averageQuality = qualityRows.length
        ? Math.round(
            qualityRows.reduce((sum, r) => sum + (r.qualityScore ?? 0), 0) /
              qualityRows.length,
          )
        : 0;

      return {
        upcomingSessions,
        activeSessions,
        completedToday,
        waitingRoomCount,
        averageQuality,
        recentSessions: recentRows.map(mapSession),
      };
    });
  }

  async joinSession(
    sessionId: string,
    participantId: string,
  ): Promise<TelemedicineSession> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.telemedicineSession.findFirst({
          where: { id: sessionId, tenantId: this.tenantId },
        });
        assertSessionFound(existing, sessionId);

        const now = new Date();
        const shouldStart =
          existing.status === 'scheduled' || existing.status === 'waiting';

        const session = await tx.telemedicineSession.update({
          where: { id: sessionId },
          data: {
            ...(shouldStart ? { status: 'in_progress' as const } : {}),
            ...(existing.actualStart == null ? { actualStart: now } : {}),
            updatedBy: this.actorId(),
          },
        });

        const participant = await tx.sessionParticipant.findFirst({
          where: {
            id: participantId,
            sessionId,
            tenantId: this.tenantId,
          },
        });

        if (participant) {
          await tx.sessionParticipant.update({
            where: { id: participantId },
            data: {
              joinedAt: now,
              leftAt: null,
            },
          });
        } else {
          await tx.sessionParticipant.create({
            data: {
              id: participantId,
              tenantId: this.tenantId,
              sessionId,
              name: 'Participant',
              role: 'observer',
              joinedAt: now,
              permissions: [],
            },
          });
        }

        return mapSession(session);
      });
    } catch (error) {
      mapTelemedicineRepositoryError(error);
    }
  }

  async leaveSession(sessionId: string): Promise<TelemedicineSession> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.telemedicineSession.findFirst({
          where: { id: sessionId, tenantId: this.tenantId },
        });
        assertSessionFound(existing, sessionId);

        if (existing.status !== 'in_progress') {
          return mapSession(existing);
        }

        const now = new Date();
        const durationMinutes = existing.actualStart
          ? Math.round(
              (now.getTime() - existing.actualStart.getTime()) / 60000,
            )
          : existing.durationMinutes;

        const session = await tx.telemedicineSession.update({
          where: { id: sessionId },
          data: {
            status: 'completed',
            actualEnd: now,
            durationMinutes,
            updatedBy: this.actorId(),
          },
        });
        return mapSession(session);
      });
    } catch (error) {
      mapTelemedicineRepositoryError(error);
    }
  }

  getParticipants(sessionId: string): Promise<VideoParticipant[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.sessionParticipant.findMany({
        where: { tenantId: this.tenantId, sessionId },
        orderBy: [{ createdAt: 'asc' }],
      });
      return items.map(mapParticipant);
    });
  }

  getMessages(sessionId: string): Promise<ChatMessage[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.sessionMessage.findMany({
        where: { tenantId: this.tenantId, sessionId },
        orderBy: [{ sentAt: 'asc' }],
      });
      return items.map(mapMessage);
    });
  }

  async sendMessage(input: SendMessageInput): Promise<ChatMessage> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const session = await tx.telemedicineSession.findFirst({
          where: { id: input.sessionId, tenantId: this.tenantId },
        });
        assertSessionFound(session, input.sessionId);

        const message = await tx.sessionMessage.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            sessionId: input.sessionId,
            senderId: input.senderId,
            senderName: input.senderName,
            receiverId: input.receiverId,
            content: input.content,
            deliveryStatus: 'sent',
          },
        });
        return mapMessage(message);
      });
    } catch (error) {
      mapTelemedicineRepositoryError(error);
    }
  }

  getClinicalNotes(sessionId: string): Promise<ClinicalNote[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.sessionClinicalNote.findMany({
        where: { tenantId: this.tenantId, sessionId },
        orderBy: [{ createdAt: 'desc' }],
      });
      return items.map(mapClinicalNote);
    });
  }

  async saveClinicalNote(input: SaveClinicalNoteInput): Promise<ClinicalNote> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const session = await tx.telemedicineSession.findFirst({
          where: { id: input.sessionId, tenantId: this.tenantId },
        });
        assertSessionFound(session, input.sessionId);

        const note = await tx.sessionClinicalNote.create({
          data: {
            id: newId(),
            tenantId: this.tenantId,
            sessionId: input.sessionId,
            patientId: input.patientId,
            clinicianId: input.clinicianId,
            subjective: input.subjective ?? '',
            objective: input.objective ?? '',
            assessment: input.assessment ?? '',
            plan: input.plan ?? '',
            diagnosis: input.diagnosis,
            treatment: input.treatment,
            recommendations: input.recommendations,
            followUp: input.followUp,
            status: 'draft',
          },
        });
        return mapClinicalNote(note);
      });
    } catch (error) {
      mapTelemedicineRepositoryError(error);
    }
  }

  getTimeline(sessionId: string): Promise<SessionTimelineEntry[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const tenantId = this.tenantId;
      const [session, participants, messages, notes, waitingEntries] =
        await Promise.all([
          tx.telemedicineSession.findFirst({
            where: { id: sessionId, tenantId },
          }),
          tx.sessionParticipant.findMany({
            where: { tenantId, sessionId },
            orderBy: { joinedAt: 'asc' },
            take: 30,
          }),
          tx.sessionMessage.findMany({
            where: { tenantId, sessionId },
            orderBy: { sentAt: 'desc' },
            take: 20,
          }),
          tx.sessionClinicalNote.findMany({
            where: { tenantId, sessionId },
            orderBy: { createdAt: 'desc' },
            take: 15,
          }),
          tx.waitingRoomEntry.findMany({
            where: { tenantId, sessionId },
            orderBy: { joinedAt: 'desc' },
            take: 15,
          }),
        ]);

      if (!session) return [];

      const entries: SessionTimelineEntry[] = [];

      for (const p of participants) {
        if (p.joinedAt) {
          entries.push({
            id: `${p.id}-join`,
            sessionId,
            date: p.joinedAt.toISOString(),
            type: 'join',
            title: `${p.name} joined`,
            description: `Role: ${p.role}`,
            actor: p.name,
          });
        }
        if (p.leftAt) {
          entries.push({
            id: `${p.id}-leave`,
            sessionId,
            date: p.leftAt.toISOString(),
            type: 'leave',
            title: `${p.name} left`,
            description: `Role: ${p.role}`,
            actor: p.name,
          });
        }
      }

      for (const m of messages) {
        entries.push({
          id: m.id,
          sessionId,
          date: m.sentAt.toISOString(),
          type: 'message',
          title: 'Chat message',
          description: m.content.slice(0, 80),
          actor: m.senderName,
        });
      }

      for (const n of notes) {
        entries.push({
          id: n.id,
          sessionId,
          date: n.createdAt.toISOString(),
          type: 'note',
          title: 'Clinical note',
          description: n.assessment || n.subjective || 'SOAP note saved',
          actor: n.clinicianId,
        });
      }

      for (const w of waitingEntries) {
        entries.push({
          id: w.id,
          sessionId,
          date: w.joinedAt.toISOString(),
          type: 'waiting',
          title: `Waiting room: ${w.status}`,
          description: w.patientName,
          actor: w.patientName,
        });
      }

      return entries.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    });
  }

  getWaitingRoom(sessionId?: string): Promise<WaitingRoomEntry[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.waitingRoomEntry.findMany({
        where: {
          tenantId: this.tenantId,
          ...(sessionId ? { sessionId } : {}),
        },
        orderBy: [{ joinedAt: 'asc' }],
      });
      return items.map(mapWaitingEntry);
    });
  }

  async admitWaitingRoom(entryId: string): Promise<WaitingRoomEntry> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.waitingRoomEntry.findFirst({
          where: { id: entryId, tenantId: this.tenantId },
        });
        assertWaitingEntryFound(existing, entryId);

        const entry = await tx.waitingRoomEntry.update({
          where: { id: entryId },
          data: {
            status: 'admitted',
            admittedAt: new Date(),
          },
        });
        return mapWaitingEntry(entry);
      });
    } catch (error) {
      mapTelemedicineRepositoryError(error);
    }
  }

  async rejectWaitingRoom(entryId: string): Promise<WaitingRoomEntry> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.waitingRoomEntry.findFirst({
          where: { id: entryId, tenantId: this.tenantId },
        });
        assertWaitingEntryFound(existing, entryId);

        const entry = await tx.waitingRoomEntry.update({
          where: { id: entryId },
          data: { status: 'rejected' },
        });
        return mapWaitingEntry(entry);
      });
    } catch (error) {
      mapTelemedicineRepositoryError(error);
    }
  }

  getRecordings(sessionId?: string): Promise<SessionRecording[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.sessionRecording.findMany({
        where: {
          tenantId: this.tenantId,
          ...(sessionId ? { sessionId } : {}),
        },
        orderBy: [{ createdAt: 'desc' }],
      });
      return items.map(mapRecording);
    });
  }

  getProviderAvailability(): Promise<ProviderAvailability[]> {
    return Promise.resolve(getProviderAvailabilityCatalog());
  }

  private actorId(): string {
    return (
      this.requestContext.require().userId ??
      '00000000-0000-0000-0000-000000000000'
    );
  }
}
