import { Elements } from '@workers/feed-sync/utils/feed-parser/feed-parser.interface';

export const getFeedTitle = (elements: Elements): string => {
  const titleElements = elements.find((element) => element.name === 'title');

  return `${titleElements?.elements?.[0]?.text || titleElements?.elements?.[0]?.cdata || ''}`;
};
