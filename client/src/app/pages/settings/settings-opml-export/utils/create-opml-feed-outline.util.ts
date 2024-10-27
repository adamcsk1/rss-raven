import { Feed } from '@interfaces/feed.interface';

export const createFeedOutline = (feed: Feed) => `<outline type="rss" text="${feed.name}" title="${feed.name}" xmlUrl="${feed.url}" htmlUrl=""/>`;
