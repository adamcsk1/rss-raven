export interface CleanupWorkerMessage {
  status: 'SUCCESS' | 'CATCH_ERROR' | 'MISSING_SYNC_CONFIG' | 'MISSING_SETTINGS' | 'SKIP';
  message?: string;
}

export interface CleanupWorkerData {
  parameters: { feedId?: string };
}
