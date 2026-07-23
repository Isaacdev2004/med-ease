export interface RealtimeSubscription {
  unsubscribe(): Promise<void>;
}

export interface RealtimeChangePayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  schema: string;
  newRecord?: Record<string, unknown>;
  oldRecord?: Record<string, unknown>;
}

export interface RealtimeAdapter {
  subscribeToTable(
    schema: string,
    table: string,
    filter: string | undefined,
    callback: (payload: RealtimeChangePayload) => void,
  ): Promise<RealtimeSubscription>;
}

export interface RealtimeAdapterConfig {
  supabaseUrl: string;
  serviceRoleKey: string;
}
