import { Elements } from '@workers/feed-sync/utils/feed-parser/feed-parser.interface';
import { getFeedItems } from '@workers/feed-sync/utils/feed-parser/feed/feed-items.util';
import { Element, ElementCompact } from 'xml-js';

export const getFeedElements = (parsedXml: Element | ElementCompact): { elements: Elements; items: Elements } => {
  let elements: Elements = [];
  let items: Elements = [];

  elements = parsedXml?.elements?.[0]?.elements?.[0]?.elements || [];
  items = getFeedItems(elements);

  if (items.length === 0) {
    elements = parsedXml?.elements?.[1]?.elements?.[0]?.elements || [];
    items = getFeedItems(elements);
  }

  if (items.length === 0) {
    elements = parsedXml?.elements?.[0]?.elements || [];
    items = getFeedItems(elements);
  }

  return { elements, items };
};
