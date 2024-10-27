import { News, OneNews } from '@interfaces/news.interface';
import { hashText } from '@utils/hash.util';
import { ParsedFeed } from '@workers/feed-sync/utils/feed-parser/feed-parser.interface';
import { getFeedElements } from '@workers/feed-sync/utils/feed-parser/feed/feed-elements.util';
import { getFeedImage } from '@workers/feed-sync/utils/feed-parser/feed/feed-image.util';
import { getFeedTitle } from '@workers/feed-sync/utils/feed-parser/feed/feed-title.util';
import { getNewsContent } from '@workers/feed-sync/utils/feed-parser/news/news-content.util';
import { getNewsDate } from '@workers/feed-sync/utils/feed-parser/news/news-date.util';
import { getNewsImage } from '@workers/feed-sync/utils/feed-parser/news/news-image.util';
import { getNewsLink } from '@workers/feed-sync/utils/feed-parser/news/news-link.util';
import { getNewsTitle } from '@workers/feed-sync/utils/feed-parser/news/news-title.util';
import dayjs from 'dayjs';
import { xml2js } from 'xml-js';

export const parseFeed = async (xml: string, feedUrl: string, feedId?: string, storedNews?: News): Promise<ParsedFeed> => {
  const parsedXml = xml2js(xml);
  const { elements, items } = getFeedElements(parsedXml);

  const parsedData: ParsedFeed = {
    feed: {
      id: feedId || crypto.randomUUID(),
      name: getFeedTitle(elements) || feedUrl,
      icon: getFeedImage(elements),
      categoryId: '',
      url: feedUrl,
      lastSync: dayjs().toISOString(),
      lastError: '',
      hidden: false,
    },
    news: [],
  };

  const usedIds: string[] = [];
  for (const item of items) {
    const title = getNewsTitle(item);
    const id = await hashText(`${parsedData.feed.id}-${title}`);
    const knownNews = storedNews?.find((news) => news.id === id);

    if (!usedIds.includes(id)) {
      parsedData.news.push({
        id,
        title,
        content: getNewsContent(item),
        link: getNewsLink(item),
        favorite: knownNews?.favorite || false,
        read: knownNews?.read || false,
        feedId: parsedData.feed.id,
        date: getNewsDate(item),
        image: getNewsImage(item),
      } as OneNews);
      usedIds.push(id);
    }
  }

  return parsedData;
};
