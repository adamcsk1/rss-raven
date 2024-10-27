import { Elements } from '@workers/feed-sync/utils/feed-parser/feed-parser.interface';

export const getFeedItems = (elements: Elements): Elements => {
  let items: Elements = [];

  items = elements.filter((element) => element.name === 'item');
  if (items.length === 0) items = elements.filter((element) => element.name === 'entry');

  return items;
};
