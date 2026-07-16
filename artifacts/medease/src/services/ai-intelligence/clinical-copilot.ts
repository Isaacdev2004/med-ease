import type { CopilotMessage, CopilotSession } from '@/services/ai-intelligence/types';

export const COPILOT_PROMPTS = [
  'Summarize this patient\'s recent lab trends',
  'What are the key contraindications for this medication?',
  'Draft a discharge summary for this encounter',
  'Identify potential drug interactions',
  'Explain the sepsis risk score factors',
];

export function generateCopilotResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('lab')) {
    return 'Recent labs show stable renal function (eGFR 72), mild anemia (Hb 10.8), and improving inflammatory markers (CRP trending down from 24 to 12 over 48h). Recommend continued monitoring.';
  }
  if (lower.includes('discharge')) {
    return 'Patient is clinically stable for discharge with oral antibiotics, follow-up in 7 days, and return precautions for fever or worsening symptoms. Medication reconciliation completed.';
  }
  if (lower.includes('interaction')) {
    return 'No major interactions detected between current medications. Monitor for additive sedation with concurrent opioid and benzodiazepine use.';
  }
  return 'Based on available clinical data, I recommend reviewing recent vitals, labs, and active care plan goals. AI suggestions complement — but do not replace — clinical judgment.';
}

export function createAssistantMessage(content: string): CopilotMessage {
  return {
    messageId: `msg-${Date.now()}`,
    role: 'assistant',
    content,
    timestamp: new Date().toISOString(),
  };
}

export function sessionTitleFromPrompt(prompt?: string): string {
  if (!prompt) return 'Clinical Copilot Session';
  return prompt.length > 48 ? `${prompt.slice(0, 45)}…` : prompt;
}

export function activeSessionCount(sessions: CopilotSession[]): number {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  return sessions.filter((s) => new Date(s.lastMessageAt).getTime() > cutoff).length;
}

export function toFhirGuidanceResponse(session: CopilotSession) {
  return {
    resourceType: 'GuidanceResponse',
    id: session.sessionId,
    status: 'success',
    subject: session.patientId ? { reference: `Patient/${session.patientId}` } : undefined,
    outputParameters: session.messages.map((m) => ({ name: m.role, valueString: m.content })),
  };
}
