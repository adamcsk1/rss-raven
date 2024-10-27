import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { AndroidBridgeService } from '@services/android-bridge/android-bridge.service';
import { clearErrorMessage } from '@utils/clear-error-message.util';
import { NgxSignalTranslateService, TranslateParams } from 'ngx-signal-translate';
import { MessageService } from 'primeng/api';

@Injectable()
export class ToastService {
  readonly #messageService = inject(MessageService);
  readonly #androidBridgeService = inject(AndroidBridgeService);
  readonly #ngxSignalTranslateService = inject(NgxSignalTranslateService);

  public showSuccess(messageTranslateParams: { key: string; params?: TranslateParams }, summaryTranslateKey = 'SUCCESS'): void {
    this.#show('default', 'success', false, messageTranslateParams, summaryTranslateKey);
  }

  public showError(messageTranslateParams: { key: string; params?: TranslateParams }, summaryTranslateKey = 'ERROR', clearMessage = false): void {
    this.#show('error', 'error', clearMessage, messageTranslateParams, summaryTranslateKey);
  }

  public showWarning(messageTranslateParams: { key: string; params?: TranslateParams }, summaryTranslateKey = 'WARNING'): void {
    this.#show('default', 'warn', false, messageTranslateParams, summaryTranslateKey);
  }

  public showInfo(messageTranslateParams: { key: string; params?: TranslateParams }, summaryTranslateKey = 'INFO'): void {
    this.#show('default', 'info', false, messageTranslateParams, summaryTranslateKey);
  }

  #show(
    target: 'default' | 'error',
    severity: 'error' | 'info' | 'warn' | 'success',
    clearMessage: boolean,
    messageTranslateParams: { key: string; params?: TranslateParams },
    summaryTranslateKey: string,
  ): void {
    const translatedMessage = this.#ngxSignalTranslateService.translate(clearMessage ? clearErrorMessage(messageTranslateParams.key) : messageTranslateParams.key, messageTranslateParams.params);
    const translatedSummary = this.#ngxSignalTranslateService.translate(summaryTranslateKey);

    if (environment.type === 'android') this.#androidBridgeService.postNativeMessage({ event: 'toast', data: translatedMessage });
    else {
      if (target === 'error') this.#messageService.clear('default');
      this.#messageService.add({ key: target, severity, summary: translatedSummary, detail: translatedMessage });
    }
  }
}
