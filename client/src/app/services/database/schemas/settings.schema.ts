import { Settings } from '@interfaces/settings.interface';
import { RxJsonSchema } from 'rxdb';

export const settingsSchema: RxJsonSchema<Settings> = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    theme: {
      type: 'string',
    },
    language: {
      type: 'string',
    },
    proxy: {
      type: 'object',
      properties: {
        basePath: {
          type: 'string',
        },
        token: {
          type: 'string',
        },
      },
    },
    sync: {
      type: 'object',
      properties: {
        syncOnStart: {
          type: 'boolean',
        },
        scrollMarkAsRead: {
          type: 'boolean',
        },
        maximumNewsPerFeed: {
          type: 'number',
        },
        backgroundSyncTime: {
          type: 'number',
        },
      },
    },
  },
  required: ['id', 'theme', 'proxy', 'sync', 'language'],
};
