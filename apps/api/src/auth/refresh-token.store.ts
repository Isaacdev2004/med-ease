import { createHash } from 'node:crypto';

import Redis from 'ioredis';

export interface RefreshTokenRecord {
  sessionId: string;
  userId: string;
  tenantId: string;
  familyId: string;
  rememberMe: boolean;
  version: number;
}

export class RefreshTokenStore {
  constructor(private readonly redis: Redis) {}

  private key(token: string) {
    return `auth:refresh:${createHash('sha256').update(token).digest('hex')}`;
  }

  private familyKey(familyId: string) {
    return `auth:refresh-family:${familyId}:revoked`;
  }

  async store(token: string, record: RefreshTokenRecord, ttlSeconds: number): Promise<void> {
    await this.redis.set(this.key(token), JSON.stringify(record), 'EX', ttlSeconds);
  }

  async consume(token: string): Promise<RefreshTokenRecord | null> {
    const raw = await this.redis.get(this.key(token));
    if (!raw) {
      return null;
    }
    await this.redis.del(this.key(token));
    return JSON.parse(raw) as RefreshTokenRecord;
  }

  async revokeFamily(familyId: string, ttlSeconds: number): Promise<void> {
    await this.redis.set(this.familyKey(familyId), '1', 'EX', ttlSeconds);
  }

  async isFamilyRevoked(familyId: string): Promise<boolean> {
    return (await this.redis.get(this.familyKey(familyId))) === '1';
  }
}
