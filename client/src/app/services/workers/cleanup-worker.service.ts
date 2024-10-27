import { inject, Injectable } from '@angular/core';
import { appStateToken } from '@stores/app-state.constant';
import { CleanupWorkerData, CleanupWorkerMessage } from '@workers/cleanup/cleanup.worker.interface';
import { asyncScheduler, exhaustMap, Observable, of, Subject } from 'rxjs';

@Injectable()
export class CleanupWorkerService {
  readonly #appStore = inject(appStateToken);
  readonly #messages = new Subject<CleanupWorkerMessage>();
  readonly #fire = new Subject<CleanupWorkerData>();
  #worker: Worker | undefined;

  constructor() {
    this.#fire.pipe(exhaustMap((data) => this.#createWorker(data))).subscribe();
  }

  public runWorkerOnce(force = false, feedId?: string): Observable<CleanupWorkerMessage> {
    if (!force && this.#appStore.state.settings().sync.maximumNewsPerFeed === 0) return of({ status: 'SKIP' });
    this.#fire.next({ parameters: { feedId } });
    return this.#messages.asObservable();
  }

  #createWorker(data: CleanupWorkerData): Observable<void> {
    const finished = new Subject<void>();
    this.#worker = new Worker(new URL('../../workers/cleanup/cleanup.worker', import.meta.url));
    this.#worker.onmessage = ({ data }) => {
      this.#messages.next(JSON.parse(data));
      this.#worker!.terminate();
      this.#worker = undefined;
      finished.next();
      finished.complete();
    };
    asyncScheduler.schedule(() => this.#worker!.postMessage(JSON.stringify(data)));
    return finished.asObservable();
  }
}
