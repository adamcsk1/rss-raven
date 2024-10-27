import { inject, Injectable } from '@angular/core';
import { Categories, Category } from '@interfaces/category.interface';
import { DatabaseService } from '@services/database/database.service';
import { categoriesMapper } from '@services/database/mappers/categories.mapper';
import { categoriesByHiddenSelector } from '@services/database/selectors/categories-by-hidden.selector';
import { categoryByIdSelector } from '@services/database/selectors/category-by-id.selector';
import { RxStorageWriteError } from 'rxdb';
import { concatMap, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseCategoriesFacadeService {
  readonly #databaseService = inject(DatabaseService);
  public readonly categories$: Observable<Categories> = this.#databaseService.getAll<Category>('categories').pipe(map(categoriesMapper));

  public categories(hidden = false): Observable<Categories> {
    return this.#databaseService.get('categories', categoriesByHiddenSelector(hidden)).pipe(map(categoriesMapper));
  }

  public categoryById(categoryId: string): Observable<Category> {
    return this.#databaseService.get('categories', categoryByIdSelector(categoryId)).pipe(
      map(categoriesMapper),
      map((categories) => categories[0]),
    );
  }

  public insertCategories(categories: Categories): Observable<{
    success: Categories;
    error: RxStorageWriteError<Category>[];
  }> {
    return this.#databaseService.bulkInsert<Category>('categories', categories);
  }

  public insertCategory(category: Category): Observable<unknown> {
    return this.#databaseService.insert<Category>('categories', category);
  }

  public updateCategory(category: Category): Observable<unknown> {
    return this.#databaseService.get<Category>('categories', categoryByIdSelector(category.id)).pipe(
      map((categories) => categoriesMapper(categories)[0]),
      concatMap((storedCategory) => this.#databaseService.upsert<Category>('categories', { ...storedCategory, ...category })),
    );
  }

  public removeCategoryById(categoryId: string): Observable<{
    success: Categories;
    error: RxStorageWriteError<Category>[];
  }> {
    return this.#databaseService.bulkRemove<Category>('categories', [categoryId]);
  }

  public reset(): Observable<unknown> {
    return this.#databaseService.remove('categories');
  }
}
