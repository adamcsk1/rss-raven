import dayjs from 'dayjs';
import { Element } from 'xml-js';

export const getNewsDate = (item: Element): string => {
  let date = item.elements?.find((element) => element.name === 'pubDate')?.elements?.[0]?.text;
  if (!date) date = item.elements?.find((element) => element.name === 'updated')?.elements?.[0]?.text;
  if (!date) date = item.elements?.find((element) => element.name === 'published')?.elements?.[0]?.text;
  return `${date ? dayjs(`${date}`).toISOString() : ''}` || dayjs().toISOString();
};
