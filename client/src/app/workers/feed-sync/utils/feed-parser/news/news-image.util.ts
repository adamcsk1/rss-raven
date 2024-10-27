import { getNewsContent } from '@workers/feed-sync/utils/feed-parser/news/news-content.util';
import { Element } from 'xml-js';

export const getNewsImage = (item: Element): string => {
  let imageSrc = '';

  const enclosureElement = item.elements?.find((element) => element.name === 'enclosure');
  if (`${enclosureElement?.attributes?.['type']}`.includes('image')) imageSrc = `${enclosureElement?.attributes?.['url'] || ''}`;
  if (!imageSrc) imageSrc = `${item.elements?.find((element) => element.name === 'media:content')?.attributes?.['url'] || ''}`;
  if (!imageSrc) imageSrc = `${item.elements?.find((element) => element.name === 'media:thumbnail')?.attributes?.['url'] || ''}`;
  if (!imageSrc) {
    const content = getNewsContent(item, false);
    imageSrc = /<img.*?src=["|'](.*?)["|']/gm.exec(content)?.[1] || '';
  }

  return imageSrc;
};
