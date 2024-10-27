import { Proxy } from '@interfaces/proxy.interface';

export interface Settings {
  id: string;
  theme: 'system' | 'light' | 'dark';
  language: 'en';
  proxy: Proxy;
  sync: {
    syncOnStart: boolean;
    scrollMarkAsRead: boolean;
    maximumNewsPerFeed: number;
    backgroundSyncTime: number;
  };
}
