import type { MessageTemplate } from '@/services/messaging/types';

export function renderTemplate(template: MessageTemplate, variables: Record<string, string>): { subject: string; body: string } {
  let subject = template.subject;
  let body = template.body;
  for (const [key, value] of Object.entries(variables)) {
    const token = `{{${key}}}`;
    subject = subject.replaceAll(token, value);
    body = body.replaceAll(token, value);
  }
  return { subject, body };
}

export function extractVariables(body: string): string[] {
  const matches = body.match(/\{\{(\w+)\}\}/g) ?? [];
  return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, '')))];
}

export function activeTemplateCount(templates: MessageTemplate[]): number {
  return templates.filter((t) => t.isActive).length;
}
