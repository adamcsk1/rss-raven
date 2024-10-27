import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsSync } from '@pages/settings/settings-sync/settings-sync.interface';
import { ToastService } from '@services/toast.service';
import { appStateToken } from '@stores/app-state.constant';

@Injectable()
export class SettingsSyncService {
  readonly #appStore = inject(appStateToken);
  readonly #toastService = inject(ToastService);
  readonly #router = inject(Router);

  public save(sync: SettingsSync): void {
    this.#appStore.patchState('settings', (state) => ({ ...state, sync }));
    this.#toastService.showSuccess({ key: 'MESSAGE_SYNC_SETTINGS_SAVE_SUCCESS' });
    this.#router.navigate(['/settings', 'list']);
  }
}
