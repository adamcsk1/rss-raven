import { Element } from 'xml-js';

export const getNewsContent = (item: Element, format = true): string => {
  let content = item.elements?.find((element) => element.name === 'content:encoded')?.elements?.[0]?.cdata || '';
  if (!content) {
    const descriptionElements = item.elements?.find((element) => element.name === 'description');
    content = descriptionElements?.elements?.[0]?.cdata || `${descriptionElements?.elements?.[0]?.text || ''}`;
  }
  if (!content) content = `${item.elements?.find((element) => element.name === 'content')?.elements?.[0]?.text || ''}`;

  if (!format) return content;
  else
    return content
      .replace(/(<([^>]+)>)/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
};
