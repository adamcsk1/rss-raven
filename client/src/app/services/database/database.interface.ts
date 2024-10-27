import { Category } from '@interfaces/category.interface';
import { Feed } from '@interfaces/feed.interface';
import { OneNews } from '@interfaces/news.interface';
import { Settings } from '@interfaces/settings.interface';
import { RxCollection, RxDatabase } from 'rxdb';
export interface Collections {
  feeds: Feed;
  news: OneNews;
  categories: Category;
  settings: Settings;
}

export type CreatedDatabaseCollections<T> = Required<{
  [K in keyof T]: RxCollection<T[K]>;
}>;

export interface CreatedDatabase {
  database: RxDatabase;
  collections: CreatedDatabaseCollections<Collections>;
}

export type DatabaseTables = keyof CreatedDatabase['collections'];
