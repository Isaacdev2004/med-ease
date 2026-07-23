export interface StorageHealthResult {
  ok: boolean;
  message?: string;
}

export interface StorageClientConfig {
  supabaseUrl: string;
  serviceRoleKey: string;
  bucketDocuments: string;
  bucketExports: string;
}

export interface ObjectStorageClient {
  checkBucketAccess(bucket: string): Promise<StorageHealthResult>;
  uploadObject(
    bucket: string,
    path: string,
    data: Uint8Array | ArrayBuffer,
    contentType?: string,
  ): Promise<void>;
  downloadObject(bucket: string, path: string): Promise<Uint8Array>;
  deleteObject(bucket: string, path: string): Promise<void>;
  getPublicUrl(bucket: string, path: string): string;
}
