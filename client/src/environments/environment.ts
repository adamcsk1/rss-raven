import { Environment } from './environment.interface';

export const environment: Environment = {
  type: 'browser',
  proxy: {
    basePath: '',
    token: '',
  },
  languageFilePath: 'i18n',
};
