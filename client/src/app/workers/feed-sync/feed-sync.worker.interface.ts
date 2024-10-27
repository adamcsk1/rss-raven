export interface FeedSyncWorkerMessage<T = unknown> {
  status: 'SUCCESS' | 'CATCH_ERROR' | 'REST_STATUS_ERROR' | 'MISSING_PROXY_CONFIG' | 'MISSING_SETTINGS';
  message?: string;
  data?: T;
}

export interface FeedSyncWorkerData<T = unknown> {
  syncType: 'one' | 'all' | 'add' | 'category';
  parameters?: T;
}

export type SendMessageCallback = <T = unknown>(data: FeedSyncWorkerMessage<T>) => void;
