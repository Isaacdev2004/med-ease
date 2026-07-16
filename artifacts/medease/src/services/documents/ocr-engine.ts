import type { OCRResult } from '@/services/documents/types';

export function simulateOcr(documentId: string, pageCount: number): OCRResult {
  const confidence = 0.85 + (pageCount % 3) * 0.04;
  return {
    ocrId: `ocr-${documentId}-${Date.now()}`,
    documentId,
    confidence,
    language: 'en',
    extractedText: `OCR extracted text for document ${documentId}. ${pageCount} page(s) processed with ${Math.round(confidence * 100)}% confidence.`,
    processedAt: new Date().toISOString(),
  };
}

export function ocrSuccessRate(results: OCRResult[]): number {
  if (results.length === 0) return 100;
  return Math.round((results.filter((r) => r.confidence >= 0.8).length / results.length) * 100);
}
