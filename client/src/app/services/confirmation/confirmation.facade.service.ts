import { inject, Injectable } from '@angular/core';
import { NgxSignalTranslateService, TranslateParams } from 'ngx-signal-translate';
import { Confirmation, ConfirmationService } from 'primeng/api';

export const CONFIRM_BASE_CONFIG: Confirmation = {
  icon: 'pi pi-info-circle',
  rejectButtonStyleClass: 'p-button-text',
  acceptIcon: 'none',
  rejectIcon: 'none',
};

@Injectable()
export class ConfirmationFacadeService {
  readonly #confirmationService = inject(ConfirmationService);
  readonly #ngxSignalTranslateService = inject(NgxSignalTranslateService);

  public confirm(messageTranslateParams: { key: string; params?: TranslateParams }, headerTranslateKey: string, accept: () => void): void {
    this.#confirmationService.confirm({
      ...CONFIRM_BASE_CONFIG,
      message: this.#ngxSignalTranslateService.translate(messageTranslateParams.key, messageTranslateParams.params),
      header: this.#ngxSignalTranslateService.translate(headerTranslateKey),
      accept,
    });
  }
}
