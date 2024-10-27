import { Elements } from '@workers/feed-sync/utils/feed-parser/feed-parser.interface';

export const getFeedImage = (elements: Elements): string => {
  let image = `${elements.find((element) => element.name === 'itunes:image')?.attributes?.['href'] || ''}`;

  if (!image) {
    const iconElements = elements.find((element) => element.name === 'icon');
    image = `${iconElements?.elements?.[0]?.text || ''}`;
  }

  if (!image) {
    const imageElements = elements.find((element) => element.name === 'image');
    const imageElement = imageElements?.elements?.find((element) => element.name === 'url');
    image = `${imageElement?.elements?.[0]?.text || ''}`;
  }

  return image;
};
