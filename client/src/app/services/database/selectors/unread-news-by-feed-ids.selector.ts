import { OneNews } from '@interfaces/news.interface';
import { MangoQuerySelectorAndIndex } from 'rxdb';

export const unreadNewsByFeedIdsSelector = (feedIds: string[]): MangoQuerySelectorAndIndex<OneNews> => ({
  selector: {
    feedId: {
      $in: feedIds,
    },
    read: {
      $eq: false,
    },
  },
  index: ['feedId', 'read'],
});
