import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Settings } from '@interfaces/settings.interface';
import { ToastService } from '@services/toast.service';
import { appStateToken } from '@stores/app-state.constant';

@Injectable()
export class SettingsThemeService {
  readonly #appStore = inject(appStateToken);
  readonly #toastService = inject(ToastService);
  readonly #router = inject(Router);

  public save(theme: Settings['theme']): void {
    this.#appStore.patchState('settings', (state) => ({ ...state, theme }));
    this.#toastService.showSuccess({ key: 'MESSAGE_THEME_SAVE_SUCCESS' });
    this.#router.navigate(['/settings', 'list']);
  }
}
