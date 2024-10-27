import { Feed } from '@interfaces/feed.interface';
import { MangoQuerySelectorAndIndex } from 'rxdb';

export const feedsByCategoryIdsAndHiddenSelector = (categoryIds: string[], hidden: boolean): MangoQuerySelectorAndIndex<Feed> => ({
  selector: {
    categoryId: {
      $in: categoryIds,
    },
    hidden: {
      $eq: hidden,
    },
  },
  index: ['categoryId', 'hidden'],
});
