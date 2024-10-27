import { effect, inject, Injectable, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { ToastService } from '@services/toast.service';
import { appStateToken } from '@stores/app-state.constant';
import { effectOnce } from '@utils/effect-once.util';
import { NgxSignalTranslateService } from 'ngx-signal-translate';

@Injectable()
export class BlockerService {
  readonly #appStore = inject(appStateToken);
  readonly #toastService = inject(ToastService);
  readonly #router = inject(Router);
  readonly #ngxSignalTranslateService = inject(NgxSignalTranslateService);

  constructor() {
    effect(() => {
      const settings = this.#appStore.state.settings();
      untracked(() => this.#appStore.patchState('blocker', (state) => ({ ...state, proxyWarning: !settings.proxy.basePath || !settings.proxy.token })));
    });

    effectOnce(
      () => this.#appStore.state.blocker().dbError !== null,
      () => this.check(),
    );
  }

  public check(): void {
    if (typeof Worker === 'undefined') {
      this.#appStore.patchState('blocker', (state) => ({
        ...state,
        blocked: true,
        errors: [...state.errors, this.#ngxSignalTranslateService.translate('MESSAGE_WEBWORKER_SUPPORT_ERROR')],
      }));
    }

    if (this.#appStore.state.blocker().dbError) {
      this.#appStore.patchState('blocker', (state) => {
        let error = '';

        switch (environment.type) {
          case 'electron':
            error = this.#ngxSignalTranslateService.translate('MESSAGE_DB_ERROR_ELECTRON');
            break;
          case 'android':
            error = this.#ngxSignalTranslateService.translate('MESSAGE_DB_ERROR_ANDROID');
            break;
          default:
            error = this.#ngxSignalTranslateService.translate('MESSAGE_DB_ERROR');
        }

        return {
          ...state,
          blocked: true,
          errors: [...state.errors, error],
        };
      });
    }

    if (this.#appStore.state.blocker().blocked) this.#router.navigate(['/blocked']);
  }

  public warningCheck(): void {
    if (this.#appStore.state.blocker().proxyWarning) this.#toastService.showWarning({ key: 'MESSAGE_MISSING_PROXY_CONFIGURATION' });
  }
}
