import { Environment } from '@environments/environment.interface';

export const environment: Environment = {
  type: 'electron',
  proxy: {
    basePath: 'electron://rssr-raven.electron.localhost/',
    token: '-',
  },
  languageFilePath: `${/file:\/\/\/(.*)index\.html/gm.exec(window.location.href)?.[1] || ''}i18n`,
};
