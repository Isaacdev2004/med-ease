import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { hashPassword, verifyPassword } from './password';

describe('password hashing', () => {
  it('hashes and verifies passwords with Argon2id', async () => {
    const hash = await hashPassword('demo');
    assert.notEqual(hash, 'demo');
    assert.equal(await verifyPassword('demo', hash), true);
    assert.equal(await verifyPassword('wrong', hash), false);
  });
});
