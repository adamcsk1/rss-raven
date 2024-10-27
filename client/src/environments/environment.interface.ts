import { Settings } from '@interfaces/settings.interface';

export type EnvironmentType = 'browser' | 'android' | 'electron';

export interface Environment {
  type: EnvironmentType;
  proxy: Settings['proxy'];
  languageFilePath: string;
}
