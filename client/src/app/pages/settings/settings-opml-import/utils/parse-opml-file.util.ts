import { Categories, Category } from '@interfaces/category.interface';
import { Feeds } from '@interfaces/feed.interface';
import dayjs from 'dayjs';
import { xml2js } from 'xml-js';

export const parseOpmlFile = (xml: string): { feeds: Feeds; categories: Categories } => {
  const parsedXml = xml2js(xml);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let xmlBody: any = [];
  if (parsedXml.elements[0].elements?.[0]?.name === 'body') xmlBody = parsedXml.elements[0].elements[0].element;
  else if (parsedXml.elements[0].elements?.[1]?.name === 'body') xmlBody = parsedXml.elements[0].elements[1].elements;
  else if (parsedXml.elements?.[1]?.elements?.[1]?.name === 'body') xmlBody = parsedXml.elements[1].elements[1].elements;

  let categories: Categories = [];
  let feeds: Feeds = [];
  const unsorted: Category = {
    id: crypto.randomUUID(),
    name: `Unsorted - ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
    hidden: false,
  };
  const unsortedFeeds: Feeds = [];

  for (const bodyElements of xmlBody) {
    if (bodyElements.name !== 'outline') continue;

    if (!Array.isArray(bodyElements.elements)) {
      unsortedFeeds.push({
        id: crypto.randomUUID(),
        name: bodyElements.attributes.text || bodyElements.attributes.title,
        categoryId: unsorted.id,
        icon: '',
        url: bodyElements.attributes.xmlUrl,
        lastSync: '',
        lastError: '',
        hidden: false,
      });
    } else {
      const category = {
        id: crypto.randomUUID(),
        name: bodyElements.attributes.text || bodyElements.attributes.title,
        hidden: false,
      };
      categories.push(category);

      for (const feedElements of bodyElements.elements) {
        if (feedElements.name !== 'outline') continue;
        feeds.push({
          id: crypto.randomUUID(),
          name: feedElements.attributes.text || feedElements.attributes.title,
          categoryId: category.id,
          icon: '',
          url: feedElements.attributes.xmlUrl,
          lastSync: '',
          lastError: '',
          hidden: false,
        });
      }
    }
  }

  if (unsortedFeeds.length > 0) {
    categories = [unsorted, ...categories];
    feeds = [...feeds, ...unsortedFeeds];
  }

  return { categories, feeds };
};
