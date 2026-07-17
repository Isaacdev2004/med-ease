import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { toContractPaginated } from './contract-pagination';
import { toPaginatedResult } from './pagination';

describe('toContractPaginated', () => {
  it('removes totalPages from paginated results', () => {
    const contract = toContractPaginated(
      toPaginatedResult([{ id: '1' }], 1, 1, 25),
    );
    assert.deepEqual(contract, {
      items: [{ id: '1' }],
      page: 1,
      pageSize: 25,
      total: 1,
    });
    assert.ok(!('totalPages' in contract));
  });
});
