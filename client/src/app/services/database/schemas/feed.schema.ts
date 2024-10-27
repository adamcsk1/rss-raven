import { Feed } from '@interfaces/feed.interface';
import { RxJsonSchema } from 'rxdb';

export const feedSchema: RxJsonSchema<Feed> = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    name: {
      type: 'string',
    },
    categoryId: {
      type: 'string',
      maxLength: 100,
    },
    icon: {
      type: 'string',
    },
    url: {
      type: 'string',
    },
    lastSync: {
      type: 'string',
    },
    lastError: {
      type: 'string',
    },
    hidden: {
      type: 'boolean',
    },
  },
  required: ['id', 'name', 'categoryId', 'icon', 'url', 'lastSync', 'lastError', 'hidden'],
  indexes: ['categoryId', 'hidden', ['categoryId', 'hidden']],
};
