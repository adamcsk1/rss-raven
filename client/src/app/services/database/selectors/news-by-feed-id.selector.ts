import { OneNews } from '@interfaces/news.interface';
import { MangoQuerySelectorAndIndex } from 'rxdb';

export const newsByFeedIdSelector = (feedId: string): MangoQuerySelectorAndIndex<OneNews> => ({
  selector: {
    feedId: {
      $eq: feedId,
    },
  },
  index: 'feedId',
});
