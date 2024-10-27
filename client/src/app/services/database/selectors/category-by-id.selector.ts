import { Category } from '@interfaces/category.interface';
import { MangoQuerySelectorAndIndex } from 'rxdb';

export const categoryByIdSelector = (categoryId: string): MangoQuerySelectorAndIndex<Category> => ({
  selector: {
    id: {
      $eq: categoryId,
    },
  },
  index: 'id',
});
