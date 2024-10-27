export interface SettingsItem {
  label: string;
  key: 'manage-proxy' | 'change-theme' | 'sync-preferences' | 'opml-import' | 'about' | 'opml-export' | 'settings-export' | 'settings-import' | 'reset' | 'cleanup' | 'change-language';
  path?: string[];
  hidden?: boolean;
}

export type SettingsItems = SettingsItem[];

export type Settings = Record<string, SettingsItems>;
