/// <reference lib="webworker" />

import { CreatedDatabase } from '@services/database/database.interface';
import { newsMapper } from '@services/database/mappers/news.mapper';
import { settingsMapper } from '@services/database/mappers/settings.mapper';
import { newsForCleanupSelectorByFeedId } from '@services/database/selectors/news-for-cleanup-by-feed-id.selector';
import { newsForCleanupSelector } from '@services/database/selectors/news-for-cleanup.selector';
import { settingsSelector } from '@services/database/selectors/settings.selector';
import { createDatabase } from '@services/database/utils/create-database.util';
import { sortByDate } from '@utils/sort/sort-by-date.util';
import { CleanupWorkerData, CleanupWorkerMessage } from '@workers/cleanup/cleanup.worker.interface';

addEventListener('message', async ({ data }: { data: string }) => {
  let createdDatabase!: CreatedDatabase;

  try {
    const workerData = JSON.parse(data) as CleanupWorkerData;

    createdDatabase = await createDatabase();
    const collections = createdDatabase.collections;
    const settingsDocument = await collections.settings.findOne(settingsSelector).exec();

    if (settingsDocument === null) return postFormattedMessage({ status: 'MISSING_SETTINGS' });

    const settings = settingsMapper(settingsDocument);

    if (settings === null) return postFormattedMessage({ status: 'MISSING_SETTINGS' });
    if (!settings.sync) return postFormattedMessage({ status: 'MISSING_SYNC_CONFIG' });

    const newsDocuments = await collections.news.find(!!workerData.parameters.feedId ? newsForCleanupSelectorByFeedId(workerData.parameters.feedId) : newsForCleanupSelector).exec();
    const news = newsMapper(newsDocuments).sort(sortByDate());

    const newsByFeedId: Record<string, string[]> = {};
    for (const oneNews of news) {
      if (!newsByFeedId[oneNews.feedId]) newsByFeedId[oneNews.feedId] = [];
      newsByFeedId[oneNews.feedId].push(oneNews.id);
    }

    const idsForDelete: string[] = [];
    for (const feedId in newsByFeedId) {
      const feedNewsIds = newsByFeedId[feedId];
      if (feedNewsIds.length >= settings.sync.maximumNewsPerFeed) idsForDelete.push(...feedNewsIds.slice(0, feedNewsIds.length - settings.sync.maximumNewsPerFeed));
    }

    await collections.news.bulkRemove(idsForDelete);

    await createdDatabase.database.destroy();
    postFormattedMessage({ status: 'SUCCESS' });
  } catch (error) {
    await createdDatabase?.database?.destroy();
    postFormattedMessage({ status: `CATCH_ERROR`, message: `${error}` });
  }
});

const postFormattedMessage = (message: CleanupWorkerMessage) => postMessage(JSON.stringify(message));
