import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  loadConfig,
  type MedeaseConfig,
  type MedeaseEnv,
} from '@medease/config';

@Injectable()
export class MedeaseConfigService {
  private readonly config: MedeaseConfig;

  constructor(private readonly configService: ConfigService<MedeaseEnv, true>) {
    this.config = loadConfig(process.env);
  }

  get app() {
    return this.config.app;
  }

  get database() {
    return this.config.database;
  }

  get redis() {
    return this.config.redis;
  }

  get supabase() {
    return this.config.supabase;
  }

  get security() {
    return this.config.security;
  }

  get auth() {
    return this.config.auth;
  }

  get queue() {
    return this.config.queue;
  }

  get mail() {
    return this.config.mail;
  }

  get opensearch() {
    return this.config.opensearch;
  }

  get observability() {
    return this.config.observability;
  }

  get<TKey extends keyof MedeaseEnv>(key: TKey): MedeaseEnv[TKey] {
    return this.configService.get(key, { infer: true });
  }
}
