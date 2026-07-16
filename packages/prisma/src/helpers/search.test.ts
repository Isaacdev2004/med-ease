import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildOrContains, insensitiveContains, matchQuery } from './search';

describe('search helpers', () => {
  it('matchQuery matches any field case-insensitively', () => {
    assert.equal(matchQuery('doc', 'Doctor@example.com', 'Jane'), true);
    assert.equal(matchQuery('xyz', 'Doctor@example.com'), false);
    assert.equal(matchQuery(undefined, 'anything'), true);
  });

  it('buildOrContains creates Prisma OR filters', () => {
    assert.deepEqual(buildOrContains(['email', 'fullName'], 'amy'), [
      { email: insensitiveContains('amy') },
      { fullName: insensitiveContains('amy') },
    ]);
  });
});
