import { effect, inject, Injectable, untracked } from '@angular/core';
import { environment } from '@environments/environment';
import { AndroidBridgeService } from '@services/android-bridge/android-bridge.service';
import { appStateToken } from '@stores/app-state.constant';

@Injectable()
export class AndroidBridgeSyncService {
  readonly #appStore = inject(appStateToken);
  readonly #androidBridgeService = inject(AndroidBridgeService);
  #runEffects = false;

  constructor() {
    if (environment.type === 'android') {
      effect(() => {
        const settings = this.#appStore.state.settings();
        if (!this.#runEffects) return;
        untracked(() => {
          this.#androidBridgeService.postNativeMessage({ event: 'backgroundSyncTime', data: settings.sync.backgroundSyncTime });
          this.#androidBridgeService.postNativeMessage({ event: 'language', data: settings.language });
        });
      });
      effect(() => {
        const syncInProgress = this.#appStore.state.syncInProgress();
        if (!this.#runEffects) return;
        untracked(() => this.#androidBridgeService.postNativeMessage({ event: 'syncInProgress', data: syncInProgress }));
      });
    }
  }

  public initialize(): void {
    this.#runEffects = true;
  }
}
