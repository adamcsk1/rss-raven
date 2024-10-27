import { Feed } from '@interfaces/feed.interface';
import { MangoQuerySelectorAndIndex } from 'rxdb';

export const feedsByCategoryIdSelector = (categoryId: string): MangoQuerySelectorAndIndex<Feed> => ({
  selector: {
    categoryId: {
      $eq: categoryId,
    },
  },
  index: ['categoryId'],
});
