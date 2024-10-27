import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, ElementRef, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { OneNews } from '@interfaces/news.interface';
import { NewsItemService } from '@pages/news/news-item/news-item.service';
import { ImageAvailablePipe } from '@pipes/image-available.pipe';
import { DatabaseFeedsFacadeService } from '@services/database/facades/database-feeds.facade.service';
import { MarkAsReadService } from '@services/mark-as-read.service';
import { NewsActionsService } from '@services/news-actions.service';
import { appStateToken } from '@stores/app-state.constant';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { ButtonModule } from 'primeng/button';
import { take } from 'rxjs';

@Component({
  selector: 'rssr-news-item',
  standalone: true,
  imports: [ImageAvailablePipe, DatePipe, NgClass, ButtonModule, NgxSignalTranslatePipe],
  templateUrl: './news-item.component.html',
  styleUrl: './news-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NewsItemService],
})
export class NewsItemComponent implements OnInit, OnDestroy {
  readonly #destroyRef = inject(DestroyRef);
  readonly #appStore = inject(appStateToken);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #databaseFeedsFacadeService = inject(DatabaseFeedsFacadeService);
  readonly #markAsReadService = inject(MarkAsReadService);
  readonly #newsItemService = inject(NewsItemService);
  readonly #newsActionsService = inject(NewsActionsService);
  readonly #elementRef = inject(ElementRef);
  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #feedName = signal('');
  #intersectionObserver!: IntersectionObserver;
  #preventDetailOpen = false;
  public readonly news = input.required<OneNews>();
  public readonly feedName = this.#feedName.asReadonly();

  public ngOnInit(): void {
    const routeFeedId = this.#route.snapshot.paramMap.get('feedId');
    if (routeFeedId) this.#feedName.set(this.#appStore.state.pageTitle());
    else {
      this.#databaseFeedsFacadeService
        .feedById(this.news().feedId)
        .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
        .subscribe((feed) => this.#feedName.set(feed.name));
    }

    if (this.#appStore.state.settings().sync.scrollMarkAsRead) {
      let intersectedBoundingClientRect: DOMRect;
      this.#intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting && intersectedBoundingClientRect) {
            if (entry.boundingClientRect.top < intersectedBoundingClientRect.top && Number.isFinite(intersectedBoundingClientRect.top) && Number.isFinite(entry.boundingClientRect.top))
              this.onSetRead();
          } else if (entry.isIntersecting && !intersectedBoundingClientRect) {
            intersectedBoundingClientRect = entry.boundingClientRect;
          }
        },
        {
          root: null,
          threshold: 0,
        },
      );

      this.#intersectionObserver.observe(this.#elementRef.nativeElement);
    }
  }

  public ngOnDestroy(): void {
    this.#intersectionObserver?.disconnect();
  }

  public onCopyLink(): void {
    this.#newsActionsService.copyLink(this.news().link);
  }

  public onNavigate($event?: MouseEvent): void {
    if (!$event || ($event as MouseEvent).button === 1) {
      this.#preventDetailOpen = true;
      const news = this.news();
      $event?.preventDefault();
      $event?.stopPropagation();
      this.onSetRead();
      window.open(news.link, 'blank');
    }
  }

  public onNavigateToFeed(): void {
    this.#router.navigate(['/news', 'feed', this.news().feedId]);
  }

  public onSetRead(): void {
    const news = this.news();
    if (!news.read) {
      this.#intersectionObserver?.disconnect();
      this.#markAsReadService.markById(news.id);
      this.news().read = true;
      this.#changeDetectorRef.markForCheck();
    }
  }

  public onToggleFavorite(): void {
    const news = this.news();
    this.#newsActionsService.toggleFavorite(news.id);
  }

  public onOpenDetail(): void {
    if (!this.#preventDetailOpen) {
      this.#newsItemService.openDetails(this.news());
      this.onSetRead();
    }
    this.#preventDetailOpen = false;
  }
}
