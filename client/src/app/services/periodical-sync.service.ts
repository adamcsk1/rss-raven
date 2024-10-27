import { effect, inject, Injectable, untracked } from '@angular/core';
import { environment } from '@environments/environment';
import { IdleService } from '@services/idle.service';
import { NewsSyncService } from '@services/news-sync/news-sync.service';
import { appStateToken } from '@stores/app-state.constant';
import { filter, interval, Subscription } from 'rxjs';

@Injectable()
export class PeriodicalSyncService {
  readonly #appStore = inject(appStateToken);
  readonly #newsSyncService = inject(NewsSyncService);
  readonly #idleService = inject(IdleService);
  #periodicSyncSubscription!: Subscription;
  #usedBackgroundSyncTime = 0;
  #runEffects = false;

  constructor() {
    if (environment.type !== 'android')
      effect(() => {
        const settings = this.#appStore.state.settings();

        if (!this.#runEffects) return;

        const backgroundSyncTime = settings.sync.backgroundSyncTime;

        if (!!backgroundSyncTime && this.#usedBackgroundSyncTime != backgroundSyncTime) {
          untracked(() => {
            this.#periodicSyncSubscription?.unsubscribe();
            this.#usedBackgroundSyncTime = backgroundSyncTime;
            this.#periodicSyncSubscription = interval(this.#usedBackgroundSyncTime * 3600000)
              .pipe(filter(() => this.#idleService.idle()))
              .subscribe(() => this.#newsSyncService.sync({ syncType: 'all' }));
          });
        }
      });
  }

  public initialize(): void {
    this.#runEffects = true;
  }
}
