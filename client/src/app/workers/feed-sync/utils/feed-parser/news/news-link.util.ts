import { Element } from 'xml-js';

export const getNewsLink = (item: Element): string => {
  const linkElements = item.elements?.find((element) => element.name === 'link');
  let link = `${linkElements?.elements?.[0]?.text || linkElements?.elements?.[0]?.cdata || ''}`;

  if (!link) link = `${item.elements?.find((element) => element.name === 'link')?.attributes?.['href'] || ''}`;

  return link;
};
