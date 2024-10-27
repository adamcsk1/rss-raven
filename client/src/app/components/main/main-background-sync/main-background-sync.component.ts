import { ChangeDetectionStrategy, Component, effect, inject, untracked } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AndroidBridgeService } from '@services/android-bridge/android-bridge.service';
import { NewsSyncService } from '@services/news-sync/news-sync.service';
import { FeedSyncWorkerService } from '@services/workers/feed-sync-worker.service';
import { appStateToken } from '@stores/app-state.constant';
import { asyncScheduler } from 'rxjs';

@Component({
  selector: 'rssr-main-background-sync',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet/>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NewsSyncService],
})
export class MainBackgroundSyncComponent {
  readonly #appStore = inject(appStateToken);
  readonly #newsSyncService = inject(NewsSyncService);
  readonly #feedSyncWorkerService = inject(FeedSyncWorkerService);
  readonly #androidBridgeService = inject(AndroidBridgeService);

  constructor() {
    this.#androidBridgeService.initialize();
    this.#feedSyncWorkerService.createWorker();
    asyncScheduler.schedule(() => this.#newsSyncService.sync({ syncType: 'all' }), 1000);

    let syncStarted = false;
    effect(() => {
      const syncInProgress = this.#appStore.state.syncInProgress();
      if (!syncInProgress && !syncStarted) syncStarted = true;
      else if (!syncInProgress && syncStarted) untracked(() => this.#androidBridgeService.postNativeMessage({ event: 'backgroundSyncFinished', data: true }));
    });
  }
}
