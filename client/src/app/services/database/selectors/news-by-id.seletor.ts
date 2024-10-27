import { OneNews } from '@interfaces/news.interface';
import { MangoQuerySelectorAndIndex } from 'rxdb';

export const newsByIdSelector = (id: string): MangoQuerySelectorAndIndex<OneNews> => ({
  selector: {
    id: {
      $eq: id,
    },
  },
  index: 'id',
});
