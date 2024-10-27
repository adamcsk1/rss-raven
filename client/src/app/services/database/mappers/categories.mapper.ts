import { Category } from '@interfaces/category.interface';
import { RxDocument } from 'rxdb';

export const categoriesMapper = (categories: RxDocument<Category>[]) =>
  categories.map((document) => ({ id: document.get('id'), name: document.get('name'), hidden: document.get('hidden') }) as Category);
