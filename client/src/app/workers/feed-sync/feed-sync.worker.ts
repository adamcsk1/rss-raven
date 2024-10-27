/// <reference lib="webworker" />

import { Feed } from '@interfaces/feed.interface';
import { FeedAdd } from '@pages/feed/feed-add/feed-add.interface';
import { CreatedDatabase } from '@services/database/database.interface';
import { newsMapper } from '@services/database/mappers/news.mapper';
import { settingsMapper } from '@services/database/mappers/settings.mapper';
import { settingsSelector } from '@services/database/selectors/settings.selector';
import { createDatabase } from '@services/database/utils/create-database.util';
import { NewsSync } from '@services/news-sync/news-sync.interface';
import { FeedSyncWorkerData, FeedSyncWorkerMessage, SendMessageCallback } from '@workers/feed-sync/feed-sync.worker.interface';
import { addFeed } from '@workers/feed-sync/utils/add-feed.util';
import { fetchFeed } from '@workers/feed-sync/utils/fetch-feed.util';
import { processFeed } from '@workers/feed-sync/utils/process-feed.util';
import { RxDocument } from 'rxdb';

const workerTask = async ({ data, sendMessage }: { data: string; sendMessage: SendMessageCallback }) => {
  let createdDatabase!: CreatedDatabase;

  try {
    const workerData = JSON.parse(data) as FeedSyncWorkerData;
    createdDatabase = await createDatabase();
    const collections = createdDatabase.collections;
    const settingsDocument = await collections.settings.findOne(settingsSelector).exec();

    if (settingsDocument === null) {
      await createdDatabase.database.destroy();
      return sendMessage({ status: 'MISSING_SETTINGS' });
    }

    const settings = settingsMapper(settingsDocument);

    if (settings === null) {
      await createdDatabase.database.destroy();
      return sendMessage({ status: 'MISSING_SETTINGS' });
    }
    if (!settings.proxy.token) {
      await createdDatabase.database.destroy();
      return sendMessage({ status: 'MISSING_PROXY_CONFIG' });
    }

    if (workerData.syncType === 'add') {
      const parameters = workerData.parameters as FeedAdd;
      const parsedFeed = await fetchFeed(settings, parameters.url);
      await addFeed(collections, parsedFeed, parameters);
    } else {
      const parameters = workerData.parameters as NewsSync;
      const feedsDocuments = await collections.feeds.find().exec();
      const newsDocuments = await collections.news.find().exec();
      const news = newsMapper(newsDocuments);
      const feedDocumentsForSync: RxDocument<Feed>[] = [];

      if (workerData.syncType === 'one') feedDocumentsForSync.push(...feedsDocuments.filter((document) => document.get('id') === parameters.feedId));
      else if (workerData.syncType === 'category') feedDocumentsForSync.push(...feedsDocuments.filter((document) => document.get('categoryId') === parameters.categoryId));
      else if (workerData.syncType === 'all') feedDocumentsForSync.push(...feedsDocuments);

      const promises = [];
      for (const document of feedDocumentsForSync) promises.push(processFeed(settings, collections, document, news));

      await Promise.all(promises);
    }

    await createdDatabase.database.destroy();
    sendMessage({ status: 'SUCCESS' });
  } catch (error) {
    await createdDatabase?.database?.destroy();
    sendMessage({ status: `CATCH_ERROR`, message: `${error}` });
  }
};

addEventListener('message', async ({ data }) => {
  const sendMessage = <T = unknown>(message: FeedSyncWorkerMessage<T>) => postMessage(JSON.stringify(message));
  await workerTask({ data, sendMessage });
});
