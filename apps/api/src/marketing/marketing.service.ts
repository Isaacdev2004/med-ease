import { Injectable, Logger } from '@nestjs/common';
import { Prisma, PrismaService } from '@medease/prisma';
import { newId } from '@medease/uuid';

import type { CreateMarketingLeadDto } from './dto/create-lead.dto';
import { MarketingMailService } from './marketing-mail.service';

function extractLeadEmail(fields: Record<string, unknown>): string | null {
  const raw = fields.email;
  if (typeof raw !== 'string') {
    return null;
  }

  const email = raw.trim().toLowerCase();
  return email.length > 0 ? email : null;
}

@Injectable()
export class MarketingService {
  private readonly logger = new Logger(MarketingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly marketingMail: MarketingMailService,
  ) {}

  async createLead(dto: CreateMarketingLeadDto) {
    const id = newId();
    const email = extractLeadEmail(dto.fields);

    await this.prisma.runInSystemTransaction(async (tx) => {
      await tx.marketingLead.create({
        data: {
          id,
          ctaId: dto.ctaId,
          email,
          fields: dto.fields as Prisma.InputJsonValue,
        },
      });
    });

    this.logger.log({
      event: 'marketing_lead_created',
      id,
      ctaId: dto.ctaId,
      email,
    });

    void this.marketingMail
      .notifyLeadSubmitted({
        id,
        ctaId: dto.ctaId,
        email,
        fields: dto.fields,
      })
      .catch((error: unknown) => {
        this.logger.warn({
          event: 'marketing_lead_email_failed',
          id,
          message: error instanceof Error ? error.message : String(error),
        });
      });

    return {
      ok: true,
      id,
      ctaId: dto.ctaId,
    };
  }
}
