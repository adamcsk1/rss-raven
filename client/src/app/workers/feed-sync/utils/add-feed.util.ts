import { FeedAdd } from '@pages/feed/feed-add/feed-add.interface';
import { CreatedDatabase } from '@services/database/database.interface';
import { ParsedFeed } from '@workers/feed-sync/utils/feed-parser/feed-parser.interface';

export const addFeed = async (collections: CreatedDatabase['collections'], parsedFeed: ParsedFeed, parameters: FeedAdd) => {
  if (parameters.categoryType === 'new') {
    parsedFeed.feed.categoryId = crypto.randomUUID();
    await collections.categories.insert({ id: parsedFeed.feed.categoryId, name: parameters.newCategoryName, hidden: false });
    await collections.feeds.insert(parsedFeed.feed);
  } else await collections.feeds.insert({ ...parsedFeed.feed, categoryId: parameters.existingCategoryId });

  await collections.news.bulkUpsert(parsedFeed.news);
};
