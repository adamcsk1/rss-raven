import { OneNews } from '@interfaces/news.interface';
import { RxDocument } from 'rxdb';

export const newsMapper = (news: RxDocument<OneNews>[]) =>
  news.map(
    (document) =>
      ({
        id: document.get('id'),
        title: document.get('title'),
        content: document.get('content'),
        link: document.get('link'),
        favorite: document.get('favorite'),
        read: document.get('read'),
        feedId: document.get('feedId'),
        date: document.get('date'),
        image: document.get('image'),
      }) as OneNews,
  );
