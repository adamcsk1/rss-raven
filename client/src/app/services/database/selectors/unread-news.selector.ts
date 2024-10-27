import { OneNews } from '@interfaces/news.interface';
import { MangoQuerySelectorAndIndex } from 'rxdb';

export const unreadNewsSelector: MangoQuerySelectorAndIndex<OneNews> = {
  selector: {
    read: {
      $eq: false,
    },
  },
  index: ['read'],
};
