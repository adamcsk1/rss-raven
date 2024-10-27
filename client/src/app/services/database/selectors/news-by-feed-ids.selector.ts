import { OneNews } from '@interfaces/news.interface';
import { MangoQuerySelectorAndIndex } from 'rxdb';

export const newsByFeedIdsSelector = (feedIds: string[]): MangoQuerySelectorAndIndex<OneNews> => ({
  selector: {
    feedId: {
      $in: feedIds,
    },
  },
  index: 'feedId',
});
