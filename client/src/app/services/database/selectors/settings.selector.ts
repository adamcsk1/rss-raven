import { Settings } from '@pages/settings/settings-list/settings-list.interface';
import { MangoQuerySelectorAndIndex } from 'rxdb';

export const settingsSelector: MangoQuerySelectorAndIndex<Settings> = {
  selector: {
    id: {
      $eq: 'settings',
    },
  },
  index: 'id',
};
