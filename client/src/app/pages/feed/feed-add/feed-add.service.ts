import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FeedAdd } from '@pages/feed/feed-add/feed-add.interface';
import { LastErrorPipe } from '@pipes/last-error.pipe';
import { DatabaseFeedsFacadeService } from '@services/database/facades/database-feeds.facade.service';
import { ToastService } from '@services/toast.service';
import { FeedSyncWorkerService } from '@services/workers/feed-sync-worker.service';
import { appStateToken } from '@stores/app-state.constant';
import { clearErrorMessage } from '@utils/clear-error-message.util';
import { filter, take, tap } from 'rxjs';

@Injectable()
export class FeedAddService {
  readonly #destroyRef = inject(DestroyRef);
  readonly #appStore = inject(appStateToken);
  readonly #feedSyncWorkerService = inject(FeedSyncWorkerService);
  readonly #databaseFeedsFacadeService = inject(DatabaseFeedsFacadeService);
  readonly #router = inject(Router);
  readonly #toastService = inject(ToastService);
  readonly #lastErrorPipe = inject(LastErrorPipe);

  public feedAdd(feedAddData: FeedAdd): void {
    this.#appStore.setState('blockerLoading', true);
    this.#databaseFeedsFacadeService.feeds$.pipe(take(1), takeUntilDestroyed(this.#destroyRef)).subscribe((feeds) => {
      const findResult = feeds.find((feed) => feed.url === feedAddData.url);
      if (findResult) {
        this.#appStore.setState('blockerLoading', false);
        this.#toastService.showError({ key: 'MESSAGE_KNOWN_FEED', params: { name: findResult.name } });
      } else this.#feedAdd(feedAddData);
    });
  }

  #feedAdd(feedAddData: FeedAdd): void {
    this.#feedSyncWorkerService.messages$
      .pipe(
        take(1),
        tap(() => this.#appStore.setState('blockerLoading', false)),
        tap((message) => {
          if (message.status !== 'SUCCESS') {
            this.#toastService.showError({ key: message.message ? this.#lastErrorPipe.transform(clearErrorMessage(message.message)) : `MESSAGE_WORKER_${message.status}` }, 'ERROR', true);
          }
        }),
        filter((message) => message.status === 'SUCCESS'),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(() => {
        this.#router.navigate(['/news']);
        this.#toastService.showSuccess({ key: 'MESSAGE_FEED_FOLLOW_SUCCESS' });
      });

    this.#feedSyncWorkerService.postMessage({
      syncType: 'add',
      parameters: feedAddData,
    });
  }
}
