import { Category } from '@interfaces/category.interface';

export const createCategoryOutline = (category: Category, feedBody: string) => `<outline text="${category.name}" title="${category.name}">${feedBody}</outline>`;
