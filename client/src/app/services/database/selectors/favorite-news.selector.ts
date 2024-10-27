import { OneNews } from '@interfaces/news.interface';
import { MangoQuerySelectorAndIndex } from 'rxdb';

export const favoriteNewsSelector: MangoQuerySelectorAndIndex<OneNews> = {
  selector: {
    favorite: {
      $eq: true,
    },
  },
  index: 'favorite',
};
