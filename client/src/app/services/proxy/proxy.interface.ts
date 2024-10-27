import { Feed } from '@interfaces/feed.interface';
import { News } from '@interfaces/news.interface';

export interface ParsedFeedData {
  feed: Feed;
  news: News;
}
