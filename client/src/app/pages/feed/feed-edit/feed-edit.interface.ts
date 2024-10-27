import { Feed } from '@interfaces/feed.interface';

export interface FeedEdit extends Feed {
  categoryType: 'new' | 'existing';
  newCategoryName: string;
}
