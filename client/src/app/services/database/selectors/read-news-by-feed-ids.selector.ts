import { OneNews } from '@interfaces/news.interface';
import { MangoQuerySelectorAndIndex } from 'rxdb';

export const readNewsByFeedIdsSelector = (feedIds: string[]): MangoQuerySelectorAndIndex<OneNews> => ({
  selector: {
    feedId: {
      $in: feedIds,
    },
    read: {
      $eq: true,
    },
  },
  index: ['feedId', 'read'],
});
