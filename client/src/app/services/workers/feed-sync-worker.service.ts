import { inject, Injectable } from '@angular/core';
import { appStateToken } from '@stores/app-state.constant';
import { FeedSyncWorkerData, FeedSyncWorkerMessage } from '@workers/feed-sync/feed-sync.worker.interface';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeedSyncWorkerService {
  readonly #appStore = inject(appStateToken);
  readonly #messages = new Subject<FeedSyncWorkerMessage>();

  #worker!: Worker;
  public readonly messages$ = this.#messages.asObservable();

  public createWorker(): void {
    if (!this.#worker) {
      this.#worker = new Worker(new URL('../../workers/feed-sync/feed-sync.worker', import.meta.url));
      this.#worker.onmessage = ({ data }) => {
        this.#messages.next(JSON.parse(data));
        this.#appStore.setState('syncInProgress', false);
        this.#appStore.setState('manualSyncInProgress', false);
      };
    }
  }

  public postMessage(data: FeedSyncWorkerData): void {
    if (!this.#appStore.state.syncInProgress()) {
      this.#appStore.setState('syncInProgress', true);
      this.#worker?.postMessage(JSON.stringify(data));
    }
  }
}
