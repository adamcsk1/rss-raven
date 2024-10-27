import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Feed, Feeds, FeedsByCategories } from '@interfaces/feed.interface';
import { DatabaseService } from '@services/database/database.service';
import { DatabaseCategoriesFacadeService } from '@services/database/facades/database-categories.facade.service';
import { feedsMapper } from '@services/database/mappers/feeds.mapper';
import { feedByIdSelector } from '@services/database/selectors/feed-by-id.selector';
import { feedsByCategoryIdAndHiddenSelector } from '@services/database/selectors/feeds-by-category-id-and-hidden.selector';
import { feedsByCategoryIdSelector } from '@services/database/selectors/feeds-by-category-id.selector';
import { feedsByCategoryIdsAndHiddenSelector } from '@services/database/selectors/feeds-by-category-ids-and-hidden.selector';
import { RxStorageWriteError } from 'rxdb';
import { combineLatest, concatMap, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseFeedsFacadeService {
  readonly #databaseService = inject(DatabaseService);
  readonly #databaseCategoriesFacadeService = inject(DatabaseCategoriesFacadeService);
  public readonly feeds$ = this.#databaseService.getAll<Feed>('feeds').pipe(map(feedsMapper));
  public readonly feedsCollectByCategories = toSignal(
    combineLatest([this.feeds$, this.#databaseCategoriesFacadeService.categories$]).pipe(
      map(([feeds, categories]) => {
        const result: FeedsByCategories = [];

        for (const category of categories) {
          const categoryFeeds = feeds.filter((feed) => feed.categoryId === category.id);
          if (categoryFeeds.length > 0) result.push({ category, feeds: categoryFeeds });
        }

        return result;
      }),
    ),
  );

  public feedsByCategoryIds(categoryIds: string[], hidden = false): Observable<Feeds> {
    return this.#databaseService.get<Feed>('feeds', feedsByCategoryIdsAndHiddenSelector(categoryIds, hidden)).pipe(map(feedsMapper));
  }

  public feedsByCategoryId(categoryId: string, hidden: boolean | undefined): Observable<Feeds> {
    if (hidden === undefined) return this.#databaseService.get<Feed>('feeds', feedsByCategoryIdSelector(categoryId)).pipe(map(feedsMapper));
    else return this.#databaseService.get<Feed>('feeds', feedsByCategoryIdAndHiddenSelector(categoryId, hidden)).pipe(map(feedsMapper));
  }

  public feedById(feedId: string): Observable<Feed> {
    return this.#databaseService.get('feeds', feedByIdSelector(feedId)).pipe(
      map(feedsMapper),
      map((feeds) => feeds[0]),
    );
  }

  public insertFeeds(feeds: Feeds): Observable<{
    success: Feeds;
    error: RxStorageWriteError<Feed>[];
  }> {
    return this.#databaseService.bulkInsert<Feed>('feeds', feeds);
  }

  public updateFeed(feed: Feed): Observable<unknown> {
    return this.#databaseService.get<Feed>('feeds', feedByIdSelector(feed.id)).pipe(
      map((feeds) => feedsMapper(feeds)[0]),
      concatMap((storedFeed) => this.#databaseService.upsert<Feed>('feeds', { ...storedFeed, ...feed })),
    );
  }

  public removeFeedById(feedId: string): Observable<{
    success: Feeds;
    error: RxStorageWriteError<Feed>[];
  }> {
    return this.#databaseService.bulkRemove<Feed>('feeds', [feedId]);
  }

  public removeFeedsByCategoryId(categoryId: string): Observable<{
    success: Feeds;
    error: RxStorageWriteError<Feed>[];
  }> {
    return this.feedsByCategoryId(categoryId, false).pipe(
      concatMap((feeds) =>
        this.#databaseService.bulkRemove<Feed>(
          'feeds',
          feeds.map((feed) => feed.id),
        ),
      ),
    );
  }

  public reset(): Observable<unknown> {
    return this.#databaseService.remove('feeds');
  }
}
