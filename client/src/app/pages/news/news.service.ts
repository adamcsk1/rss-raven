import { computed, DestroyRef, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { News } from '@interfaces/news.interface';
import { DatabaseNewsFacadeService } from '@services/database/facades/database-news.facade.service';
import { MarkAsReadService } from '@services/mark-as-read.service';
import { appStateToken } from '@stores/app-state.constant';
import { sortByDate } from '@utils/sort/sort-by-date.util';
import { combineLatest, filter, interval, map, mergeMap, Subject, switchMap, take } from 'rxjs';

@Injectable()
export class NewsService {
  readonly #destroyRef = inject(DestroyRef);
  readonly #appStore = inject(appStateToken);
  readonly #route = inject(ActivatedRoute);
  readonly #databaseNewsFacadeService = inject(DatabaseNewsFacadeService);
  readonly #markAsReadService = inject(MarkAsReadService);
  readonly #blockerEvents$ = combineLatest([toObservable(this.#appStore.state.blockerLoading), toObservable(this.#appStore.state.spinnerLoading)]);
  readonly #news = signal<News | null>(null);
  readonly #preloadedNews = signal<News | null>(null);
  readonly #loadNewsAfterManualSync = new Subject<void>();
  public readonly news = computed(() => {
    const searchText = this.#appStore.state.search().text.toLowerCase();
    const news = this.#news();

    if (searchText && Array.isArray(news)) return news.filter((news) => news.title.toLowerCase().includes(searchText) || news.content.toLowerCase().includes(searchText));
    else return news;
  });
  public readonly newNewsCount = computed(() => {
    const news = this.#news();
    const preloadedNews = this.#preloadedNews();
    if (Array.isArray(news) && Array.isArray(preloadedNews)) {
      const diff = preloadedNews.length - news.length;
      return diff > 0 ? diff : null;
    }

    return null;
  });
  public readonly loadNewsAfterManualSync$ = this.#loadNewsAfterManualSync.asObservable();

  constructor() {
    interval(5000)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.loadNews(false));

    this.#markAsReadService.marked$
      .pipe(
        filter((type) => type === 'all'),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(() => this.loadNews());

    let isManualSync = false;
    effect(() => {
      if (this.#appStore.state.syncInProgress() && this.#appStore.state.manualSyncInProgress() && !isManualSync) isManualSync = true;
      if (!this.#appStore.state.syncInProgress() && isManualSync) {
        isManualSync = false;
        untracked(() => {
          this.#loadNewsAfterManualSync.next();
          this.loadNews(false);
        });
      }
    });
  }

  public loadNews(autoApply = true): void {
    this.#route.paramMap
      .pipe(
        mergeMap((params) => {
          const feedId = params.get('feedId');
          const categoryId = params.get('categoryId');
          const favorites = params.get('filter') === 'favorites';
          let unread = undefined;
          if (params.get('filter') === 'unread') unread = true;
          if (params.get('filter') === 'read') unread = false;

          if (favorites) return this.#databaseNewsFacadeService.favoriteNews();
          else if (feedId) return this.#databaseNewsFacadeService.newsByFeedId(feedId, unread);
          else if (categoryId) return this.#databaseNewsFacadeService.newsByCategoryId(categoryId, unread, false);
          else return this.#databaseNewsFacadeService.news(unread, false);
        }),
        switchMap((news) =>
          this.#blockerEvents$.pipe(
            filter(([blockerLoading, spinnerLoading]) => !blockerLoading && !spinnerLoading),
            map(() => news.sort(sortByDate('desc'))),
            take(1),
          ),
        ),
        take(1),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe((news) => {
        this.#preloadedNews.set(news);
        if (autoApply) this.applyPreloadedNews();
      });
  }

  public applyPreloadedNews(): void {
    this.#news.set(this.#preloadedNews());
  }
}
