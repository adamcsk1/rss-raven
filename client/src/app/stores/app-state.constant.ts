import { environment } from '@environments/environment';
import { AppState } from '@stores/app-state.interface';
import { createInjectionToken } from 'ngx-simple-signal-store';

export const appStateToken = createInjectionToken<AppState>('AppState');

export const initialAppState: AppState = {
  settings: {
    id: 'settings',
    theme: 'system',
    language: 'en',
    proxy: { basePath: environment.proxy.basePath, token: environment.proxy.token },
    sync: {
      syncOnStart: false,
      scrollMarkAsRead: false,
      maximumNewsPerFeed: 1000,
      backgroundSyncTime: 0,
    },
  },
  spinnerLoading: false,
  blockerLoading: false,
  newsContentRendered: false,
  pageTitle: '',
  pageBackPath: [],
  newsParameters: {
    feedId: null,
    categoryId: null,
  },
  blocker: {
    blocked: false,
    errors: [],
    proxyWarning: false,
    dbError: null,
  },
  syncInProgress: false,
  search: {
    show: false,
    text: '',
  },
  manualSyncInProgress: false,
};
