import { inject, Injectable } from '@angular/core';
import { News, OneNews } from '@interfaces/news.interface';
import { DatabaseService } from '@services/database/database.service';
import { DatabaseCategoriesFacadeService } from '@services/database/facades/database-categories.facade.service';
import { DatabaseFeedsFacadeService } from '@services/database/facades/database-feeds.facade.service';
import { newsMapper } from '@services/database/mappers/news.mapper';
import { favoriteNewsSelector } from '@services/database/selectors/favorite-news.selector';
import { newsByFeedIdSelector } from '@services/database/selectors/news-by-feed-id.selector';
import { newsByFeedIdsSelector } from '@services/database/selectors/news-by-feed-ids.selector';
import { newsByIdSelector } from '@services/database/selectors/news-by-id.seletor';
import { readNewsByFeedIdSelector } from '@services/database/selectors/read-news-by-feed-id.selector';
import { readNewsByFeedIdsSelector } from '@services/database/selectors/read-news-by-feed-ids.selector';
import { unreadNewsByFeedIdSelector } from '@services/database/selectors/unread-news-by-feed-id.selector';
import { unreadNewsByFeedIdsSelector } from '@services/database/selectors/unread-news-by-feed-ids.selector';
import { unreadNewsSelector } from '@services/database/selectors/unread-news.selector';
import { RxStorageWriteError } from 'rxdb';
import { concatMap, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseNewsFacadeService {
  readonly #databaseService = inject(DatabaseService);
  readonly #databaseFeedsFacadeService = inject(DatabaseFeedsFacadeService);
  readonly #databaseCategoriesFacadeService = inject(DatabaseCategoriesFacadeService);
  public readonly unreadCount$ = this.#databaseService.count<OneNews>('news', unreadNewsSelector);
  public readonly news$: Observable<News> = this.#databaseService.getAll<OneNews>('news').pipe(map(newsMapper));

  public unreadCountByFeedId(feedId: string): Observable<number> {
    return this.#databaseService.count<OneNews>('news', unreadNewsByFeedIdSelector(feedId));
  }

  public countByFeedId(feedId: string): Observable<number> {
    return this.#databaseService.count<OneNews>('news', newsByFeedIdSelector(feedId));
  }

  public news(unread: boolean | undefined, hidden = false): Observable<News> {
    return this.#databaseCategoriesFacadeService.categories(hidden).pipe(
      concatMap((categories) =>
        this.#databaseFeedsFacadeService.feedsByCategoryIds(
          categories.map((category) => category.id),
          hidden,
        ),
      ),
      concatMap((feeds) => {
        const feedIds = feeds.map((feed) => feed.id);

        if (unread === true) return this.#databaseService.get<OneNews>('news', unreadNewsByFeedIdsSelector(feedIds)).pipe(map(newsMapper));
        else if (unread === false) return this.#databaseService.get<OneNews>('news', readNewsByFeedIdsSelector(feedIds)).pipe(map(newsMapper));
        else return this.#databaseService.get<OneNews>('news', newsByFeedIdsSelector(feedIds)).pipe(map(newsMapper));
      }),
    );
  }

  public newsByFeedId(feedId: string, unread: boolean | undefined): Observable<News> {
    if (unread === true) return this.#databaseService.get<OneNews>('news', unreadNewsByFeedIdSelector(feedId)).pipe(map(newsMapper));
    else if (unread === false) return this.#databaseService.get<OneNews>('news', readNewsByFeedIdSelector(feedId)).pipe(map(newsMapper));
    else return this.#databaseService.get<OneNews>('news', newsByFeedIdSelector(feedId)).pipe(map(newsMapper));
  }

  public newsByCategoryId(categoryId: string, unread: boolean | undefined, hidden = false): Observable<News> {
    return this.#databaseFeedsFacadeService.feedsByCategoryId(categoryId, hidden).pipe(
      concatMap((feeds) => {
        const feedIds = feeds.map((feed) => feed.id);
        if (unread === true) return this.#databaseService.get<OneNews>('news', unreadNewsByFeedIdsSelector(feedIds)).pipe(map(newsMapper));
        else if (unread === false) return this.#databaseService.get<OneNews>('news', readNewsByFeedIdsSelector(feedIds)).pipe(map(newsMapper));
        else return this.#databaseService.get<OneNews>('news', newsByFeedIdsSelector(feedIds)).pipe(map(newsMapper));
      }),
    );
  }

  public favoriteNews(): Observable<News> {
    return this.#databaseService.get<OneNews>('news', favoriteNewsSelector).pipe(map(newsMapper));
  }

  public markAsReadByFeedId(feedId: string): Observable<{
    success: News;
    error: RxStorageWriteError<OneNews>[];
  }> {
    return this.newsByFeedId(feedId, true).pipe(
      concatMap((news) =>
        this.#databaseService.bulkUpsert<OneNews>(
          'news',
          news.map((news) => ({ ...news, read: true })),
        ),
      ),
    );
  }

  public markAsReadByCategoryId(categoryId: string): Observable<{
    success: News;
    error: RxStorageWriteError<OneNews>[];
  }> {
    return this.#databaseFeedsFacadeService.feedsByCategoryId(categoryId, undefined).pipe(
      concatMap((feeds) => this.#databaseService.get<OneNews>('news', unreadNewsByFeedIdsSelector(feeds.map((feed) => feed.id))).pipe(map(newsMapper))),
      concatMap((news) =>
        this.#databaseService.bulkUpsert<OneNews>(
          'news',
          news.map((news) => ({ ...news, read: true })),
        ),
      ),
    );
  }

  public markAllAsRead(): Observable<{
    success: News;
    error: RxStorageWriteError<OneNews>[];
  }> {
    return this.#databaseService.get<OneNews>('news', unreadNewsSelector).pipe(
      map(newsMapper),
      concatMap((news) =>
        this.#databaseService.bulkUpsert<OneNews>(
          'news',
          news.map((news) => ({ ...news, read: true })),
        ),
      ),
    );
  }

  public markAsReadById(id: string): Observable<unknown> {
    return this.#databaseService.get<OneNews>('news', newsByIdSelector(id)).pipe(
      map((news) => newsMapper(news)[0]),
      concatMap((news) => this.#databaseService.upsert<OneNews>('news', { ...news, read: true })),
    );
  }

  public removeNewsByFeedId(feedId: string): Observable<{
    success: News;
    error: RxStorageWriteError<OneNews>[];
  }> {
    return this.newsByFeedId(feedId, undefined).pipe(
      concatMap((news) =>
        this.#databaseService.bulkRemove<OneNews>(
          'news',
          news.map((oneNews) => oneNews.id),
        ),
      ),
    );
  }

  public removeNewsByCategoryId(categoryId: string): Observable<{
    success: News;
    error: RxStorageWriteError<OneNews>[];
  }> {
    return this.#databaseFeedsFacadeService.feedsByCategoryId(categoryId, false).pipe(
      concatMap((feeds) => this.#databaseService.get<OneNews>('news', newsByFeedIdsSelector(feeds.map((feed) => feed.id))).pipe(map(newsMapper))),
      concatMap((news) =>
        this.#databaseService.bulkRemove<OneNews>(
          'news',
          news.map((oneNews) => oneNews.id),
        ),
      ),
    );
  }

  public toggleFavoriteById(id: string): Observable<unknown> {
    return this.#databaseService.get<OneNews>('news', newsByIdSelector(id)).pipe(
      map((news) => newsMapper(news)[0]),
      concatMap((news) => this.#databaseService.upsert<OneNews>('news', { ...news, favorite: !news.favorite })),
    );
  }

  public reset(): Observable<unknown> {
    return this.#databaseService.remove('news');
  }
}
