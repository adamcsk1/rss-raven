import { OneNews } from '@interfaces/news.interface';
import { RxJsonSchema } from 'rxdb';

export const newsSchema: RxJsonSchema<OneNews> = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    title: {
      type: 'string',
    },
    content: {
      type: 'string',
    },
    link: {
      type: 'string',
    },
    image: {
      type: 'string',
    },
    favorite: {
      type: 'boolean',
    },
    read: {
      type: 'boolean',
    },
    feedId: {
      type: 'string',
      maxLength: 100,
    },
    date: {
      type: 'string',
    },
  },
  required: ['id', 'title', 'content', 'link', 'favorite', 'read', 'feedId', 'date', 'image'],
  indexes: ['feedId', 'read', ['feedId', 'read'], 'favorite', ['feedId', 'favorite']],
};
