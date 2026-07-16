export function parseHl7Segments(raw: string): string[] {
  return raw.split('|').slice(0, 5);
}

export function validateHl7Message(type: string, segmentCount: number): boolean {
  return segmentCount >= 3 && ['ADT', 'ORM', 'ORU', 'SIU', 'DFT', 'BAR', 'RDE', 'VXU', 'MDM'].includes(type);
}

export function buildAckMessage(controlId: string, accepted: boolean): string {
  return `MSH|^~\\&|MED-EASE|FAC|EXTERNAL|SYS|${new Date().toISOString()}||ACK|${controlId}|P|2.5\rMSA|${accepted ? 'AA' : 'AE'}|${controlId}`;
}

export function transformHl7ToFhirPreview(type: string): string {
  return `Bundle/searchset (${type} → Observation/Encounter mapping)`;
}
