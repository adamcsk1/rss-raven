import { Environment } from '@environments/environment.interface';

export const environment: Environment = {
  type: 'browser',
  proxy: {
    basePath: 'http://localhost:54321/',
    token: 'development',
  },
  languageFilePath: 'i18n',
};
