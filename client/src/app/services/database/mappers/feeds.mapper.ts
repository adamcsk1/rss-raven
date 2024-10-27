import { Feed } from '@interfaces/feed.interface';
import { RxDocument } from 'rxdb';

export const feedsMapper = (feeds: RxDocument<Feed>[]) =>
  feeds.map(
    (document) =>
      ({
        id: document.get('id'),
        name: document.get('name'),
        categoryId: document.get('categoryId'),
        icon: document.get('icon'),
        url: document.get('url'),
        lastSync: document.get('lastSync'),
        lastError: document.get('lastError'),
        hidden: document.get('hidden'),
      }) as Feed,
  );
