export interface PgClientOptions {
  connectionString: string;
  ssl?: { rejectUnauthorized: false };
}

/** pg + Supabase: sslmode=require maps to verify-full unless libpq compat is set. */
export function pgClientOptions(connectionString: string): PgClientOptions {
  const isLocal =
    connectionString.includes('localhost') ||
    connectionString.includes('127.0.0.1');

  if (isLocal) {
    return { connectionString };
  }

  let url = connectionString;
  if (!url.includes('uselibpqcompat=')) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}uselibpqcompat=true`;
  }

  return {
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  };
}
