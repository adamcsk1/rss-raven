import { computed, inject } from '@angular/core';
import { NgxSignalTranslateService } from 'ngx-signal-translate';

export const categoryTypeOptionsFactory = () => {
  const ngxSignalTranslateService = inject(NgxSignalTranslateService);

  return computed(() => [
    { label: ngxSignalTranslateService.translate('NEW'), value: 'new' },
    { label: ngxSignalTranslateService.translate('EXISTING'), value: 'existing' },
  ]);
};
