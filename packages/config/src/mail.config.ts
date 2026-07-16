import { z } from 'zod';

export const mailConfigSchema = z.object({
  MAIL_HOST: z.string().default('localhost'),
  MAIL_PORT: z.coerce.number().int().positive().default(1025),
  MAIL_FROM: z.string().email().default('noreply@medease.local'),
});

export type MailConfig = z.infer<typeof mailConfigSchema>;

export function parseMailConfig(env: NodeJS.ProcessEnv): MailConfig {
  return mailConfigSchema.parse(env);
}
