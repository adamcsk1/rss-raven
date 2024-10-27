import { Feed } from '@interfaces/feed.interface';
import { News } from '@interfaces/news.interface';
import { Element } from 'xml-js';

export type Elements = Element[];

export interface ParsedFeed {
  feed: Feed;
  news: News;
}
