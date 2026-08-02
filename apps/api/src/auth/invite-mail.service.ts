import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';

import { MedeaseConfigService } from '../config/config.service';

@Injectable()
export class InviteMailService {
  private readonly logger = new Logger(InviteMailService.name);

  constructor(private readonly config: MedeaseConfigService) {}

  async sendInviteEmail(
    to: string,
    fullName: string,
    inviteUrl: string,
  ): Promise<void> {
    const { host, port, from, user, pass } = this.config.mail;
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
    });

    const subject = "[Med'ease] You're invited to join";
    const text = [
      `Hello ${fullName},`,
      '',
      "You've been invited to join Med'ease. Set your password to activate your account:",
      '',
      inviteUrl,
      '',
      'This link expires in 72 hours. If you did not expect this invitation, you can ignore this email.',
    ].join('\n');

    await transporter.sendMail({ from, to, subject, text });

    this.logger.log({ event: 'invite_email_sent', to });
  }
}
