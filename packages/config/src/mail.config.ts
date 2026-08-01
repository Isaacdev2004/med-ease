import { z } from 'zod';

export const mailConfigSchema = z.object({
  MAIL_HOST: z.string().default('localhost'),
  MAIL_PORT: z.coerce.number().int().positive().default(1025),
  MAIL_FROM: z.string().email().default('noreply@medease.local'),
  /** Optional SMTP auth (e.g. SendGrid, Brevo, OVH). */
  MAIL_USER: z.string().optional(),
  MAIL_PASS: z.string().optional(),
  /** Inbox notified when a public CTA lead is submitted. */
  MARKETING_LEADS_NOTIFY_EMAIL: z.string().email().optional(),
});

export type MailConfig = z.infer<typeof mailConfigSchema>;

export function parseMailConfig(env: NodeJS.ProcessEnv): MailConfig {
  return mailConfigSchema.parse(env);
}
