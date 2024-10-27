import { computed, inject } from '@angular/core';
import { NgxSignalTranslateService } from 'ngx-signal-translate';

export const maximumFeedNewsOptionsFactory = () => {
  const ngxSignalTranslateService = inject(NgxSignalTranslateService);

  return computed(() => [
    { label: ngxSignalTranslateService.translate('UNLIMITED'), value: 0 },
    { label: '100', value: 100 },
    { label: '250', value: 250 },
    { label: '500', value: 500 },
    { label: '1000', value: 1000 },
    { label: '2500', value: 2500 },
  ]);
};
