import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FeedSyncWorkerService } from '@services/workers/feed-sync-worker.service';
import { appStateToken } from '@stores/app-state.constant';
import { FeedSyncWorkerData } from '@workers/feed-sync/feed-sync.worker.interface';
import { filter, take, tap } from 'rxjs';

@Injectable()
export class NewsSyncService {
  readonly #destroyRef = inject(DestroyRef);
  readonly #appStore = inject(appStateToken);
  readonly #feedSyncWorkerService = inject(FeedSyncWorkerService);

  public sync<T = unknown>(parameters?: FeedSyncWorkerData<T>): void {
    if (!this.#appStore.state.syncInProgress()) {
      const newsParameters = this.#appStore.state.newsParameters();
      const workerParameters = parameters || { syncType: newsParameters.feedId ? 'one' : newsParameters.categoryId ? 'category' : 'all', parameters: newsParameters };

      this.#appStore.setState('spinnerLoading', true);

      this.#feedSyncWorkerService.messages$
        .pipe(
          take(1),
          tap(() => this.#appStore.setState('spinnerLoading', false)),
          filter((message) => message.status === 'SUCCESS'),
          takeUntilDestroyed(this.#destroyRef),
        )
        .subscribe();

      this.#feedSyncWorkerService.postMessage(workerParameters);
    }
  }
}
