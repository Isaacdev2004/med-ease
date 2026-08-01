import { Injectable, Logger } from '@nestjs/common';

import type { CreateMarketingLeadDto } from './dto/create-lead.dto';

@Injectable()
export class MarketingService {
  private readonly logger = new Logger(MarketingService.name);

  createLead(dto: CreateMarketingLeadDto) {
    this.logger.log({
      event: 'marketing_lead_created',
      ctaId: dto.ctaId,
      fields: dto.fields,
    });

    return {
      ok: true,
      ctaId: dto.ctaId,
    };
  }
}
