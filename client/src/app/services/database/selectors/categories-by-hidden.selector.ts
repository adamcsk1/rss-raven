import { Category } from '@interfaces/category.interface';
import { MangoQuerySelectorAndIndex } from 'rxdb';

export const categoriesByHiddenSelector = (hidden: boolean): MangoQuerySelectorAndIndex<Category> => ({
  selector: {
    hidden: {
      $eq: hidden,
    },
  },
  index: 'hidden',
});
