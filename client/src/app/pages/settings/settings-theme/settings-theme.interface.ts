import { Settings } from '@interfaces/settings.interface';

export interface SettingsThemeItem {
  label: string;
  value: Settings['theme'];
}

export type SettingsThemes = SettingsThemeItem[];
