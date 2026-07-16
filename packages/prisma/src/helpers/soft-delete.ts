/** Prisma where-clause helper: active (non-deleted) rows only. */
export function activeOnly<T extends { deletedAt?: Date | null }>() {
  return { deletedAt: null } as Pick<T, 'deletedAt'>;
}

/** Prisma update helper: soft-delete a record. */
export function softDeleteData() {
  return { deletedAt: new Date() };
}

/** Prisma update helper: restore a soft-deleted record. */
export function restoreSoftDeleteData() {
  return { deletedAt: null };
}
