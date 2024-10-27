import { Element } from 'xml-js';

export const getNewsTitle = (item: Element): string => {
  const titleElements = item.elements?.find((element) => element.name === 'title');
  let title = titleElements?.elements?.[0]?.cdata || '';
  if (!title) title = `${titleElements?.elements?.[0]?.text || ''}`;
  return title;
};
