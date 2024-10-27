import { Feed } from '@interfaces/feed.interface';
import { MangoQuerySelectorAndIndex } from 'rxdb';

export const feedByIdSelector = (feedId: string): MangoQuerySelectorAndIndex<Feed> => ({
  selector: {
    id: {
      $eq: feedId,
    },
  },
  index: 'id',
});
