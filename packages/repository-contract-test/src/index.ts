export interface PaginatedResultLike<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export function expectPagination<T>(
  result: PaginatedResultLike<T>,
  expected: { page: number; pageSize: number },
): void {
  if (!Array.isArray(result.items)) {
    throw new Error('Expected paginated result.items to be an array');
  }
  if (result.page !== expected.page) {
    throw new Error(`Expected page ${expected.page}, got ${result.page}`);
  }
  if (result.pageSize !== expected.pageSize) {
    throw new Error(
      `Expected pageSize ${expected.pageSize}, got ${result.pageSize}`,
    );
  }
  if (typeof result.total !== 'number') {
    throw new Error('Expected paginated result.total to be a number');
  }
  if (result.items.length > result.pageSize) {
    throw new Error('Expected items length to be <= pageSize');
  }
}

export function expectSearchMatch(
  value: string,
  query: string,
  fields: string[],
): boolean {
  const lower = query.toLowerCase();
  return fields.some((field) => field.toLowerCase().includes(lower));
}

export async function expectRejectsWithErrorName(
  promise: Promise<unknown>,
  errorName: string,
): Promise<void> {
  try {
    await promise;
    throw new Error(`Expected promise to reject with ${errorName}`);
  } catch (error) {
    if (error instanceof Error && error.name === errorName) {
      return;
    }
    if (
      error instanceof Error &&
      error.message.startsWith('Expected promise to reject')
    ) {
      throw error;
    }
    throw new Error(
      `Expected ${errorName}, got ${error instanceof Error ? error.name : typeof error}`,
      { cause: error },
    );
  }
}

export interface RepositoryContractCapabilities {
  mutations?: boolean;
  search?: boolean;
  favorites?: boolean;
  export?: boolean;
}

export interface RepositoryContractContext<TRepository> {
  name: string;
  repository: TRepository;
  capabilities?: RepositoryContractCapabilities;
}

export async function runRepositoryContract<TRepository>(
  ctx: RepositoryContractContext<TRepository>,
  suite: (ctx: RepositoryContractContext<TRepository>) => void | Promise<void>,
): Promise<void> {
  await suite(ctx);
}
