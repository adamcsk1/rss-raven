import { Settings } from '@interfaces/settings.interface';
import { RxDocument } from 'rxdb';

export const settingsMapper = (document: RxDocument<Settings> | null): Settings | null =>
  !document
    ? null
    : ({
        id: document.get('id'),
        theme: document.get('theme'),
        language: document.get('language'),
        proxy: {
          token: document.get('proxy.token'),
          basePath: document.get('proxy.basePath'),
        },
        sync: {
          syncOnStart: document.get('sync.syncOnStart'),
          scrollMarkAsRead: document.get('sync.scrollMarkAsRead'),
          maximumNewsPerFeed: document.get('sync.maximumNewsPerFeed'),
          backgroundSyncTime: document.get('sync.backgroundSyncTime'),
        },
      } as Settings);
