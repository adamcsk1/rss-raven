import { CreatedDatabase } from '@services/database/database.interface';
import { categoriesSchema } from '@services/database/schemas/categories.schema';
import { feedSchema } from '@services/database/schemas/feed.schema';
import { newsSchema } from '@services/database/schemas/news.schema';
import { settingsSchema } from '@services/database/schemas/settings.schema';
import { createRxDatabase } from 'rxdb';
//import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

export const createDatabase = async (): Promise<CreatedDatabase> => {
  //addRxPlugin(RxDBDevModePlugin);

  return createRxDatabase({
    name: 'rssr',
    storage: getRxStorageDexie(),
  }).then((database) =>
    database
      .addCollections({
        feeds: {
          schema: feedSchema,
        },
        news: {
          schema: newsSchema,
        },
        categories: {
          schema: categoriesSchema,
        },
        settings: {
          schema: settingsSchema,
        },
      })
      .then((collections) => ({
        database,
        collections,
      })),
  );
};
