import { OneNews } from '@interfaces/news.interface';
import { MangoQuerySelectorAndIndex } from 'rxdb';

export const newsForCleanupSelector: MangoQuerySelectorAndIndex<OneNews> = {
  selector: {
    favorite: {
      $eq: false,
    },
  },
  index: ['favorite'],
};
