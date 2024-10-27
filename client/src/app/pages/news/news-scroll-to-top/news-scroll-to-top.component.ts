import { AfterViewInit, ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { scaleAnimation } from '@animations/scale.animation';
import { NewsService } from '@pages/news/news.service';
import { appStateToken } from '@stores/app-state.constant';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { ButtonModule } from 'primeng/button';
import { Scroller } from 'primeng/scroller';
import { asyncScheduler, debounceTime } from 'rxjs';

@Component({
  selector: 'rssr-news-scroll-to-top',
  standalone: true,
  imports: [ButtonModule, NgxSignalTranslatePipe],
  templateUrl: './news-scroll-to-top.component.html',
  styleUrl: './news-scroll-to-top.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scaleAnimation],
})
export class NewsScrollToTopComponent implements AfterViewInit {
  readonly #appStore = inject(appStateToken);
  readonly #destroyRef = inject(DestroyRef);
  readonly #newsService = inject(NewsService);
  readonly #showScrollTopButton = signal(false);
  #loadInProgress = false;
  public readonly target = input.required<Scroller>();
  public readonly showScrollTopButton = this.#showScrollTopButton.asReadonly();
  public readonly newNewsCount = computed(() => {
    const count = this.#newsService.newNewsCount();
    if (count) {
      if (count > 99) return '99+';
      else return `${count}`;
    }

    return '';
  });

  constructor() {
    this.#newsService.loadNewsAfterManualSync$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => this.onLoad());
  }

  public ngAfterViewInit(): void {
    this.target()
      .onScroll.pipe(debounceTime(500), takeUntilDestroyed(this.#destroyRef))
      .subscribe((event) => {
        const element = event?.originalEvent?.target as HTMLElement;
        if (element.scrollTop <= 1) {
          this.#showScrollTopButton.set(false);
          this.#loadInProgress = false;
        } else if (!this.#loadInProgress) this.#showScrollTopButton.set(true);
      });
  }

  public onClick(): void {
    this.target().scrollToIndex(0, 'smooth');
  }

  public onLoad(): void {
    this.#loadInProgress = true;
    this.#newsService.applyPreloadedNews();
    this.target().scrollToIndex(0, 'smooth');
    asyncScheduler.schedule(() => (this.#loadInProgress = false), 5000);
  }
}
