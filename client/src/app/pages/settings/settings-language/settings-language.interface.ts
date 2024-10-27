import { Settings } from '@interfaces/settings.interface';

export interface SettingsLanguageItem {
  label: string;
  value: Settings['language'];
}

export type SettingsLanguages = SettingsLanguageItem[];
