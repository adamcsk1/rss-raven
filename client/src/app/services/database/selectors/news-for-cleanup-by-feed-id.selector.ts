import { OneNews } from '@interfaces/news.interface';
import { MangoQuerySelectorAndIndex } from 'rxdb';

export const newsForCleanupSelectorByFeedId = (feedId: string): MangoQuerySelectorAndIndex<OneNews> => ({
  selector: {
    favorite: {
      $eq: false,
    },
    feedId: {
      $eq: feedId,
    },
  },
  index: ['feedId', 'favorite'],
});
