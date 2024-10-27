import { Feed } from '@interfaces/feed.interface';
import { MangoQuerySelectorAndIndex } from 'rxdb';

export const feedsByCategoryIdAndHiddenSelector = (categoryId: string, hidden: boolean): MangoQuerySelectorAndIndex<Feed> => ({
  selector: {
    categoryId: {
      $eq: categoryId,
    },
    hidden: {
      $eq: hidden,
    },
  },
  index: ['categoryId', 'hidden'],
});
