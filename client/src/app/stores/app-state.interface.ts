import { Settings } from '@interfaces/settings.interface';

export interface AppState {
  settings: Settings;
  spinnerLoading: boolean;
  blockerLoading: boolean;
  newsContentRendered: boolean;
  manualSyncInProgress: boolean;
  pageTitle: string;
  pageBackPath: string[];
  newsParameters: {
    feedId: string | null;
    categoryId: string | null;
  };
  blocker: {
    blocked: boolean;
    errors: string[];
    proxyWarning: boolean;
    dbError: boolean | null;
  };
  syncInProgress: boolean;
  search: {
    show: boolean;
    text: string;
  };
}
