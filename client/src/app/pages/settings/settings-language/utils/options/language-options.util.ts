import { computed, inject } from '@angular/core';
import { SettingsLanguages } from '@pages/settings/settings-language/settings-language.interface';
import { NgxSignalTranslateService } from 'ngx-signal-translate';

export const languageOptionsFactory = () => {
  const ngxSignalTranslateService = inject(NgxSignalTranslateService);

  return computed<SettingsLanguages>(() => [{ label: ngxSignalTranslateService.translate('ENGLISH'), value: 'en' }]);
};
