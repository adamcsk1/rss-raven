import { OneNews } from '@interfaces/news.interface';
import { MangoQuerySelectorAndIndex } from 'rxdb';

export const unreadNewsByFeedIdSelector = (feedId: string): MangoQuerySelectorAndIndex<OneNews> => ({
  selector: {
    feedId: {
      $eq: feedId,
    },
    read: {
      $eq: false,
    },
  },
  index: ['feedId', 'read'],
});
