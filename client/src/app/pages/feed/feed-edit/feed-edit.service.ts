import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FeedEdit } from '@pages/feed/feed-edit/feed-edit.interface';
import { ConfirmationFacadeService } from '@services/confirmation/confirmation.facade.service';
import { DatabaseCategoriesFacadeService } from '@services/database/facades/database-categories.facade.service';
import { DatabaseFeedsFacadeService } from '@services/database/facades/database-feeds.facade.service';
import { DatabaseNewsFacadeService } from '@services/database/facades/database-news.facade.service';
import { ToastService } from '@services/toast.service';
import { FeedSyncWorkerService } from '@services/workers/feed-sync-worker.service';
import { appStateToken } from '@stores/app-state.constant';
import { catchError, concatMap, map, of, take, tap } from 'rxjs';

@Injectable()
export class FeedEditService {
  readonly #destroyRef = inject(DestroyRef);
  readonly #appStore = inject(appStateToken);
  readonly #feedSyncWorkerService = inject(FeedSyncWorkerService);
  readonly #router = inject(Router);
  readonly #toastService = inject(ToastService);
  readonly #databaseCategoriesFacadeService = inject(DatabaseCategoriesFacadeService);
  readonly #databaseFeedsFacadeService = inject(DatabaseFeedsFacadeService);
  readonly #databaseNewsFacadeService = inject(DatabaseNewsFacadeService);
  readonly #confirmationFacadeService = inject(ConfirmationFacadeService);

  public feedUpdate(feedData: FeedEdit): void {
    if (feedData.categoryType === 'new') feedData.categoryId = crypto.randomUUID();

    this.#databaseFeedsFacadeService
      .updateFeed({
        id: feedData.id,
        name: feedData.name,
        categoryId: feedData.categoryId,
        icon: feedData.icon,
        url: feedData.url,
        lastSync: feedData.lastSync,
        lastError: feedData.lastError,
        hidden: feedData.hidden,
      })
      .pipe(
        concatMap(() =>
          feedData.categoryType === 'new' ? this.#databaseCategoriesFacadeService.insertCategory({ id: `${feedData.categoryId}`, name: feedData.newCategoryName, hidden: false }) : of(true),
        ),
        map(() => true),
        catchError((error: Error) => {
          this.#toastService.showError({ key: `${error}` }, 'ERROR', true);
          return of(false);
        }),
        take(1),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe((status) => {
        if (status) {
          this.#feedSyncWorkerService.postMessage({
            syncType: 'one',
            parameters: feedData,
          });
          this.#router.navigate(['/news', 'feed', feedData.id]);
          this.#toastService.showSuccess({ key: 'MESSAGE_FEED_EDIT_SUCCESS' });
        }
      });
  }

  public confirmFeedDelete(feedData: FeedEdit): void {
    this.#confirmationFacadeService.confirm({ key: 'CONFIRM_DELETE_FEED', params: { name: feedData.name } }, 'DELETE_FEED', () => this.#feedDelete(feedData.id));
  }

  #feedDelete(feedId: string): void {
    this.#appStore.setState('blockerLoading', true);

    this.#databaseNewsFacadeService
      .removeNewsByFeedId(feedId)
      .pipe(
        tap((results) => {
          if (results.error.length > 0) throw new Error('MESSAGE_FEED_NEWS_DELETE_FAILED');
        }),
        concatMap(() => this.#databaseFeedsFacadeService.removeFeedById(feedId)),
        tap((results) => {
          if (results.error.length > 0) throw new Error('MESSAGE_FEED_DELETE_FAILED');
        }),
        map(() => true),
        take(1),
        catchError((error) => {
          this.#toastService.showError({ key: `${error}` }, 'ERROR', true);
          return of(false);
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe((status) => {
        this.#appStore.setState('blockerLoading', false);
        if (status) {
          this.#router.navigate(['/news']);
          this.#toastService.showSuccess({ key: 'MESSAGE_FEED_DELETE_SUCCESS' });
        }
      });
  }
}
