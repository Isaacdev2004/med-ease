import { Injectable } from '@nestjs/common';

import {
  generateInviteToken,
  hashInviteToken,
  hashPassword,
} from '@medease/auth';
import { PrismaService } from '@medease/prisma';
import { newId } from '@medease/uuid';

import { MedeaseConfigService } from '../config/config.service';
import { AuthHttpException } from './auth.exceptions';
import { InviteMailService } from './invite-mail.service';

export interface InvitePreview {
  email: string;
  fullName: string;
  expiresAt: string;
}

@Injectable()
export class InviteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: MedeaseConfigService,
    private readonly inviteMail: InviteMailService,
  ) {}

  buildInviteUrl(token: string): string {
    const base =
      this.config.app.publicUrl ??
      (this.config.app.corsOrigin !== '*'
        ? this.config.app.corsOrigin.split(',')[0]?.trim()
        : undefined) ??
      'http://localhost:5173';
    return `${base.replace(/\/$/, '')}/accept-invite?token=${encodeURIComponent(token)}`;
  }

  async issueInvite(
    userId: string,
    invitedById?: string,
  ): Promise<{ token: string }> {
    const token = generateInviteToken();
    const tokenHash = hashInviteToken(token);
    const expiresAt = new Date(
      Date.now() + this.config.auth.inviteExpiryHours * 60 * 60 * 1000,
    );

    await this.prisma.runInSystemTransaction(async (tx) => {
      await tx.userInvite.updateMany({
        where: { userId, usedAt: null },
        data: { usedAt: new Date() },
      });

      await tx.userInvite.create({
        data: {
          id: newId(),
          userId,
          tokenHash,
          expiresAt,
          invitedById,
        },
      });
    });

    return { token };
  }

  async sendInviteForUser(
    userId: string,
    invitedById?: string,
  ): Promise<void> {
    const user = await this.prisma.runInSystemTransaction(async (tx) =>
      tx.user.findUnique({ where: { id: userId } }),
    );

    if (!user) {
      throw AuthHttpException.inviteInvalid();
    }

    const { token } = await this.issueInvite(userId, invitedById);
    const inviteUrl = this.buildInviteUrl(token);

    try {
      await this.inviteMail.sendInviteEmail(
        user.email,
        user.fullName,
        inviteUrl,
      );
    } catch {
      // Invite record exists; admin can resend. Do not fail user creation.
    }
  }

  async previewInvite(token: string): Promise<InvitePreview> {
    const invite = await this.findValidInvite(token);
    const user = await this.prisma.runInSystemTransaction(async (tx) =>
      tx.user.findUnique({ where: { id: invite.userId } }),
    );

    if (!user || user.status !== 'pending') {
      throw AuthHttpException.inviteInvalid();
    }

    return {
      email: user.email,
      fullName: user.fullName,
      expiresAt: invite.expiresAt.toISOString(),
    };
  }

  async acceptInvite(
    token: string,
    password: string,
    fullName?: string,
  ): Promise<void> {
    const invite = await this.findValidInvite(token);

    const user = await this.prisma.runInSystemTransaction(async (tx) =>
      tx.user.findUnique({ where: { id: invite.userId } }),
    );

    if (!user || user.status !== 'pending') {
      throw AuthHttpException.inviteInvalid();
    }

    const passwordHash = await hashPassword(password);

    await this.prisma.runInSystemTransaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          status: 'active',
          ...(fullName?.trim() ? { fullName: fullName.trim() } : {}),
        },
      });

      await tx.userInvite.update({
        where: { id: invite.id },
        data: { usedAt: new Date() },
      });
    });
  }

  private async findValidInvite(token: string) {
    const tokenHash = hashInviteToken(token.trim());
    const invite = await this.prisma.runInSystemTransaction(async (tx) =>
      tx.userInvite.findFirst({
        where: { tokenHash, usedAt: null },
        orderBy: { createdAt: 'desc' },
      }),
    );

    if (!invite) {
      throw AuthHttpException.inviteInvalid();
    }

    if (invite.expiresAt <= new Date()) {
      throw AuthHttpException.inviteExpired();
    }

    return invite;
  }
}
