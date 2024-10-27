import { Category } from '@interfaces/category.interface';

export interface Feed {
  id: string;
  name: string;
  categoryId: string;
  icon: string;
  url: string;
  lastSync: string;
  lastError: string;
  hidden: boolean;
}

export type Feeds = Feed[];

export interface FeedsByCategory {
  category: Category;
  feeds: Feeds;
}

export type FeedsByCategories = FeedsByCategory[];
