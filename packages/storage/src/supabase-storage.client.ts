import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type {
  ObjectStorageClient,
  StorageClientConfig,
  StorageHealthResult,
} from './types';

export class SupabaseStorageClient implements ObjectStorageClient {
  private readonly client: SupabaseClient;

  constructor(private readonly config: StorageClientConfig) {
    this.client = createClient(config.supabaseUrl, config.serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  async checkBucketAccess(bucket: string): Promise<StorageHealthResult> {
    const { error } = await this.client.storage.from(bucket).list('', {
      limit: 1,
    });

    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true };
  }

  async uploadObject(
    bucket: string,
    path: string,
    data: Uint8Array | ArrayBuffer,
    contentType?: string,
  ): Promise<void> {
    const { error } = await this.client.storage
      .from(bucket)
      .upload(path, data, {
        contentType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }
  }

  async downloadObject(bucket: string, path: string): Promise<Uint8Array> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .download(path);

    if (error || !data) {
      throw new Error(
        `Storage download failed: ${error?.message ?? 'empty response'}`,
      );
    }

    return new Uint8Array(await data.arrayBuffer());
  }

  async deleteObject(bucket: string, path: string): Promise<void> {
    const { error } = await this.client.storage.from(bucket).remove([path]);

    if (error) {
      throw new Error(`Storage delete failed: ${error.message}`);
    }
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.client.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}

export function createStorageClient(
  config: StorageClientConfig,
): ObjectStorageClient {
  return new SupabaseStorageClient(config);
}

export function createStorageClientFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): ObjectStorageClient {
  const supabaseUrl = env.SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for storage',
    );
  }

  return createStorageClient({
    supabaseUrl,
    serviceRoleKey,
    bucketDocuments:
      env.SUPABASE_STORAGE_BUCKET_DOCUMENTS ?? 'medease-documents',
    bucketExports: env.SUPABASE_STORAGE_BUCKET_EXPORTS ?? 'medease-exports',
  });
}
