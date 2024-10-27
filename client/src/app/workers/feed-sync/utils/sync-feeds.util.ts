import { Feeds } from '@interfaces/feed.interface';
import { News } from '@interfaces/news.interface';
import { CreatedDatabase } from '@services/database/database.interface';

export const syncFeeds = async (collections: CreatedDatabase['collections'], parsedFeeds: Feeds, parsedNews: News) => {
  await collections.feeds.bulkUpsert(parsedFeeds);
  await collections.news.bulkUpsert(parsedNews);
};
