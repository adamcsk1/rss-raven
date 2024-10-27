import { Environment } from '@environments/environment.interface';

export const environment: Environment = {
  type: 'android',
  proxy: {
    basePath: 'https://rssr-raven.android-native.localhost/',
    token: '-',
  },
  languageFilePath: 'assets/i18n',
};
