import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Proxy } from '@interfaces/proxy.interface';
import { ToastService } from '@services/toast.service';
import { appStateToken } from '@stores/app-state.constant';

@Injectable()
export class SettingsProxyService {
  readonly #appStore = inject(appStateToken);
  readonly #toastService = inject(ToastService);
  readonly #router = inject(Router);

  public save(proxy: Proxy): void {
    this.#appStore.patchState('settings', (state) => ({ ...state, proxy }));
    this.#toastService.showSuccess({ key: 'MESSAGE_PROXY_SETTINGS_SAVE_SUCCESS' });
    this.#router.navigate(['/settings', 'list']);
  }
}
