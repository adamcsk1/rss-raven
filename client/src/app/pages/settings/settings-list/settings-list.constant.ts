import { Settings } from '@pages/settings/settings-list/settings-list.interface';

export const SETTINGS: Settings = {
  APPEARANCE: [
    {
      label: 'THEME',
      key: 'change-theme',
      path: ['/settings', 'theme'],
    },
    {
      label: 'LANGUAGE',
      key: 'change-language',
      path: ['/settings', 'language'],
    },
  ],
  PROXY: [
    {
      label: 'MANGE_PROXY',
      key: 'manage-proxy',
      path: ['/settings', 'proxy'],
    },
  ],
  SYNC: [
    {
      label: 'SYNC_PREFERENCES',
      key: 'sync-preferences',
      path: ['/settings', 'sync'],
    },
  ],
  IMPORT_AND_EXPORT: [
    {
      label: 'OPML_IMPORT',
      key: 'opml-import',
      path: ['/settings', 'opml-import'],
    },
    {
      label: 'OPML_EXPORT',
      key: 'opml-export',
      path: ['/settings', 'opml-export'],
    },
    {
      label: 'SETTINGS_IMPORT',
      key: 'settings-import',
      path: ['/settings', 'settings-import'],
    },
    {
      label: 'SETTINGS_EXPORT',
      key: 'settings-export',
      path: ['/settings', 'settings-export'],
    },
  ],
  STORAGE: [
    {
      label: 'RESET_APPLICATION_DATA',
      key: 'reset',
      path: ['/settings', 'reset'],
    },
    {
      label: 'DATA_CLEANUP',
      key: 'cleanup',
      path: ['/settings', 'cleanup'],
    },
  ],
  OTHERS: [
    {
      label: 'ABOUT',
      key: 'about',
      path: ['/about'],
    },
  ],
};
