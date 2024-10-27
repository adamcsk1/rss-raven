import { computed, inject } from '@angular/core';
import { SettingsThemes } from '@pages/settings/settings-theme/settings-theme.interface';
import { NgxSignalTranslateService } from 'ngx-signal-translate';

export const themeOptionsFactory = () => {
  const ngxSignalTranslateService = inject(NgxSignalTranslateService);

  return computed<SettingsThemes>(() => [
    { label: ngxSignalTranslateService.translate('System'), value: 'system' },
    { label: ngxSignalTranslateService.translate('LIGHT'), value: 'light' },
    { label: ngxSignalTranslateService.translate('DARK'), value: 'dark' },
  ]);
};
