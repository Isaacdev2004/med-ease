export function addAnnotation(sessionId: string, label: string, x: number, y: number) {
  return { id: `ann-${Date.now()}`, sessionId, label, x, y, createdAt: new Date().toISOString() };
}
