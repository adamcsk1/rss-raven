import { computed, inject } from '@angular/core';
import { NgxSignalTranslateService } from 'ngx-signal-translate';

export const backgroundSyncOptionsFactory = () => {
  const ngxSignalTranslateService = inject(NgxSignalTranslateService);

  return computed(() => [
    { label: ngxSignalTranslateService.translate('DISABLED'), value: 0 },
    { label: ngxSignalTranslateService.translate('EVERY_30_MIN'), value: 0.5 },
    { label: ngxSignalTranslateService.translate('EVERY_HOUR'), value: 1 },
  ]);
};
