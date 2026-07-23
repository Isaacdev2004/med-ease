import {
  createClient,
  type RealtimePostgresChangesPayload,
  type SupabaseClient,
} from '@supabase/supabase-js';

import type {
  RealtimeAdapter,
  RealtimeAdapterConfig,
  RealtimeChangePayload,
  RealtimeSubscription,
} from './types';

function mapPayload(
  payload: RealtimePostgresChangesPayload<Record<string, unknown>>,
): RealtimeChangePayload {
  return {
    eventType: payload.eventType,
    table: payload.table,
    schema: payload.schema,
    newRecord: payload.new,
    oldRecord: payload.old,
  };
}

export class SupabaseRealtimeAdapter implements RealtimeAdapter {
  private readonly client: SupabaseClient;

  constructor(config: RealtimeAdapterConfig) {
    this.client = createClient(config.supabaseUrl, config.serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  async subscribeToTable(
    schema: string,
    table: string,
    filter: string | undefined,
    callback: (payload: RealtimeChangePayload) => void,
  ): Promise<RealtimeSubscription> {
    const channel = this.client
      .channel(`medease:${schema}:${table}:${filter ?? 'all'}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema,
          table,
          filter,
        },
        (payload) => {
          callback(
            mapPayload(
              payload as RealtimePostgresChangesPayload<
                Record<string, unknown>
              >,
            ),
          );
        },
      );

    await new Promise<void>((resolve, reject) => {
      channel.subscribe((status, error) => {
        if (status === 'SUBSCRIBED') {
          resolve();
          return;
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          reject(
            error ?? new Error(`Realtime subscription failed (${status})`),
          );
        }
      });
    });

    return {
      async unsubscribe() {
        await channel.unsubscribe();
      },
    };
  }
}

export function createRealtimeAdapter(
  config: RealtimeAdapterConfig,
): RealtimeAdapter {
  return new SupabaseRealtimeAdapter(config);
}

export function createRealtimeAdapterFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): RealtimeAdapter {
  const supabaseUrl = env.SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for realtime',
    );
  }

  return createRealtimeAdapter({ supabaseUrl, serviceRoleKey });
}
