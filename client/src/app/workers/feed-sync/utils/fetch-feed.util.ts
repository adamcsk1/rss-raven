import { News } from '@interfaces/news.interface';
import { Settings } from '@interfaces/settings.interface';
import { PROXY_API_PATH } from '@services/proxy/proxy.constant';
import { clearErrorMessage } from '@utils/clear-error-message.util';
import { ParsedFeed } from '@workers/feed-sync/utils/feed-parser/feed-parser.interface';
import { parseFeed } from '@workers/feed-sync/utils/feed-parser/feed-parser.util';

export const fetchFeed = async (settings: Settings, url: string, feedId?: string, storedNews?: News): Promise<ParsedFeed> => {
  const response = await fetch(`${settings.proxy.basePath}${PROXY_API_PATH}fetch-feed?url=${encodeURIComponent(url)}`, {
    headers: {
      'Content-Type': 'text',
      Authorization: `Basic ${settings.proxy.token}`,
    },
  });
  if (!response.ok) throw new Error('MESSAGE_WORKER_FEED_FETCH_ERROR');

  const xml = await response.text();
  if (!xml) throw new Error('MESSAGE_WORKER_FEED_EMPTY');

  try {
    return await parseFeed(xml, url, feedId, storedNews);
  } catch (error) {
    throw new Error(`MESSAGE_WORKER_FEED_PROCESS_ERROR ( ${clearErrorMessage(error)} )`);
  }
};
