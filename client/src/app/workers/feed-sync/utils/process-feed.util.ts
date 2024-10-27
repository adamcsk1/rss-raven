import { Feed } from '@interfaces/feed.interface';
import { News } from '@interfaces/news.interface';
import { Settings } from '@interfaces/settings.interface';
import { CreatedDatabase } from '@services/database/database.interface';
import { feedsMapper } from '@services/database/mappers/feeds.mapper';
import { clearErrorMessage } from '@utils/clear-error-message.util';
import { fetchFeed } from '@workers/feed-sync/utils/fetch-feed.util';
import { syncFeeds } from '@workers/feed-sync/utils/sync-feeds.util';
import dayjs from 'dayjs';
import { RxDocument } from 'rxdb';

export const processFeed = async (settings: Settings, collections: CreatedDatabase['collections'], feedDocument: RxDocument<Feed>, news: News) => {
  try {
    const fetchedFeedData = await fetchFeed(settings, feedDocument.get('url'), feedDocument.get('id'), news);
    fetchedFeedData.feed.categoryId = feedDocument.get('categoryId');
    fetchedFeedData.feed.name = feedDocument.get('name');
    fetchedFeedData.feed.icon = feedDocument.get('icon') || fetchedFeedData.feed.icon;
    fetchedFeedData.feed.hidden = feedDocument.get('hidden') || fetchedFeedData.feed.hidden;

    await syncFeeds(collections, [fetchedFeedData.feed], fetchedFeedData.news);
  } catch (error) {
    collections.feeds.bulkUpsert([{ ...feedsMapper([feedDocument])[0], lastError: clearErrorMessage(error), lastSync: dayjs().toISOString() }]);
  }
};
