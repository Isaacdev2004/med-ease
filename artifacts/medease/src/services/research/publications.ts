import type { Publication, PublicationStatus } from '@/services/research/types';

export function canSubmitPublication(pub: Publication): boolean {
  return pub.status === 'draft';
}

export function publicationImpactScore(
  citations: number,
  journalTier: number,
): number {
  return Math.round(citations * journalTier);
}

export function toFhirCitation(pub: Publication) {
  return {
    resourceType: 'Citation',
    id: pub.publicationId,
    status: pub.status === 'published' ? 'active' : 'draft',
    title: pub.title,
    publicationDate: pub.publishedAt,
    author: pub.authors.map((name) => ({ name })),
  };
}

export const PUBLICATION_STATUSES: PublicationStatus[] = [
  'draft',
  'submitted',
  'under_review',
  'accepted',
  'published',
];
