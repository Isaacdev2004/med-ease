import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';

import { MedeaseConfigService } from '../config/config.service';

export interface MarketingLeadNotification {
  id: string;
  ctaId: string;
  email: string | null;
  fields: Record<string, unknown>;
}

@Injectable()
export class MarketingMailService {
  private readonly logger = new Logger(MarketingMailService.name);

  constructor(private readonly config: MedeaseConfigService) {}

  async notifyLeadSubmitted(lead: MarketingLeadNotification): Promise<void> {
    const notifyTo = this.config.mail.marketingLeadsNotifyEmail;
    if (!notifyTo) {
      this.logger.debug('MARKETING_LEADS_NOTIFY_EMAIL not set; skipping lead email');
      return;
    }

    const { host, port, from, user, pass } = this.config.mail;
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
    });

    const fieldLines = Object.entries(lead.fields)
      .map(([key, value]) => {
        const rendered = Array.isArray(value)
          ? value.join(', ')
          : String(value ?? '');
        return `${key}: ${rendered}`;
      })
      .join('\n');

    const subject = `[Med'ease] Nouveau lead — ${lead.ctaId}`;
    const text = [
      'Un nouveau lead a été soumis sur le site public Med\'ease.',
      '',
      `ID: ${lead.id}`,
      `Formulaire: ${lead.ctaId}`,
      `E-mail: ${lead.email ?? '(non renseigné)'}`,
      '',
      'Détails:',
      fieldLines || '(aucun champ)',
    ].join('\n');

    await transporter.sendMail({
      from,
      to: notifyTo,
      subject,
      text,
    });

    this.logger.log({
      event: 'marketing_lead_email_sent',
      leadId: lead.id,
      notifyTo,
    });
  }
}
