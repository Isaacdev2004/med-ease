import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { expectPagination } from './index.js';

describe('expectPagination', () => {
  it('accepts valid pagination metadata', () => {
    expectPagination({ items: [1, 2], total: 10, page: 1, pageSize: 10 }, { page: 1, pageSize: 10 });
    assert.ok(true);
  });

  it('rejects invalid page size', () => {
    assert.throws(() => {
      expectPagination({ items: [1, 2, 3], total: 10, page: 1, pageSize: 2 }, { page: 1, pageSize: 2 });
    });
  });
});
