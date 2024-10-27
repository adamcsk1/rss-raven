import { OneNews } from '@interfaces/news.interface';
import { MangoQuerySelectorAndIndex } from 'rxdb';

export const readNewsByFeedIdSelector = (feedId: string): MangoQuerySelectorAndIndex<OneNews> => ({
  selector: {
    feedId: {
      $eq: feedId,
    },
    read: {
      $eq: true,
    },
  },
  index: ['feedId', 'read'],
});
