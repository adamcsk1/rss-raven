import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { EmptyListComponent } from '@components/empty-list/empty-list.component';
import { OneNews } from '@interfaces/news.interface';
import { NewsItemComponent } from '@pages/news/news-item/news-item.component';
import { NewsScrollToTopComponent } from '@pages/news/news-scroll-to-top/news-scroll-to-top.component';
import { NewsService } from '@pages/news/news.service';
import { DatabaseCategoriesFacadeService } from '@services/database/facades/database-categories.facade.service';
import { DatabaseFeedsFacadeService } from '@services/database/facades/database-feeds.facade.service';
import { appStateToken } from '@stores/app-state.constant';
import { effectOnce } from '@utils/effect-once.util';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { ScrollerModule } from 'primeng/scroller';
import { SkeletonModule } from 'primeng/skeleton';
import { fromEvent, of } from 'rxjs';
import { map, mergeMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'rssr-news',
  standalone: true,
  imports: [ScrollerModule, EmptyListComponent, SkeletonModule, NewsItemComponent, NewsScrollToTopComponent, NgxSignalTranslatePipe],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NewsService],
})
export class NewsComponent implements OnInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #appStore = inject(appStateToken);
  readonly #route = inject(ActivatedRoute);
  readonly #newsService = inject(NewsService);
  readonly #databaseFeedsFacadeService = inject(DatabaseFeedsFacadeService);
  readonly #databaseCategoriesFacadeService = inject(DatabaseCategoriesFacadeService);
  readonly #getListHeight = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const headerHeight = Number(documentStyle.getPropertyValue('--app-header-height').replace('px', ''));
    return `${window.innerHeight - headerHeight}px`;
  };
  readonly news = this.#newsService.news;

  public readonly scrollHeight = toSignal(fromEvent(window, 'resize').pipe(startWith(this.#getListHeight()), map(this.#getListHeight)));
  public readonly newsStatus = computed(() => {
    const news = this.news();
    if (news === null) return 'NULL';
    if (news?.length === 0) return 'EMPTY';
    return 'NEWS';
  });

  constructor() {
    effectOnce(
      () => Array.isArray(this.news()),
      () => this.#appStore.setState('newsContentRendered', true),
    );
  }

  public ngOnInit(): void {
    this.#route.paramMap
      .pipe(
        mergeMap((params) => {
          const feedId = params.get('feedId');
          const categoryId = params.get('categoryId');
          const favorites = params.get('filter') === 'favorites';
          this.#appStore.setState('newsParameters', { feedId, categoryId });

          if (favorites) return of('FAVORITES');
          else if (feedId) return this.#databaseFeedsFacadeService.feedById(feedId).pipe(map((feed) => feed.name));
          else if (categoryId) return this.#databaseCategoriesFacadeService.categoryById(categoryId).pipe(map((category) => category.name));
          else return of('ALL_FEED');
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe((title) => this.#appStore.setState('pageTitle', title));

    this.#route.paramMap.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => this.#newsService.loadNews());
  }

  public trackBy(index: number, news: OneNews): string {
    return news.id || `${index}`;
  }
}
