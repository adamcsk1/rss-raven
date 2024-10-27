import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Category } from '@interfaces/category.interface';
import { ConfirmationFacadeService } from '@services/confirmation/confirmation.facade.service';
import { DatabaseCategoriesFacadeService } from '@services/database/facades/database-categories.facade.service';
import { DatabaseFeedsFacadeService } from '@services/database/facades/database-feeds.facade.service';
import { DatabaseNewsFacadeService } from '@services/database/facades/database-news.facade.service';
import { ToastService } from '@services/toast.service';
import { appStateToken } from '@stores/app-state.constant';
import { catchError, concatMap, map, of, take, tap } from 'rxjs';

@Injectable()
export class CategoryEditService {
  readonly #destroyRef = inject(DestroyRef);
  readonly #appStore = inject(appStateToken);
  readonly #router = inject(Router);
  readonly #toastService = inject(ToastService);
  readonly #databaseCategoriesFacadeService = inject(DatabaseCategoriesFacadeService);
  readonly #databaseFeedsFacadeService = inject(DatabaseFeedsFacadeService);
  readonly #databaseNewsFacadeService = inject(DatabaseNewsFacadeService);
  readonly #confirmationFacadeService = inject(ConfirmationFacadeService);

  public categoryUpdate(categoryData: Category): void {
    this.#databaseCategoriesFacadeService
      .updateCategory(categoryData)
      .pipe(
        map(() => true),
        take(1),
        catchError((error: Error) => {
          this.#toastService.showError({ key: `${error}` }, 'ERROR', true);
          return of(false);
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe((status) => {
        if (status) {
          this.#router.navigate(['/news', 'category', categoryData.id]);
          this.#toastService.showSuccess({ key: 'MESSAGE_CATEGORY_EDIT_SUCCESS' });
        }
      });
  }

  public confirmCategoryDelete(categoryData: Category): void {
    this.#confirmationFacadeService.confirm({ key: 'CONFIRM_DELETE_CATEGORY', params: { name: categoryData.name } }, 'DELETE_CATEGORY', () => this.#categoryDelete(categoryData.id));
  }

  #categoryDelete(categoryId: string): void {
    this.#appStore.setState('blockerLoading', true);

    this.#databaseNewsFacadeService
      .removeNewsByCategoryId(categoryId)
      .pipe(
        tap((results) => {
          if (results.error.length > 0) throw new Error('MESSAGE_CATEGORY_NEWS_DELETE_FAILED');
        }),
        concatMap(() => this.#databaseFeedsFacadeService.removeFeedsByCategoryId(categoryId)),
        tap((results) => {
          if (results.error.length > 0) throw new Error('MESSAGE_CATEGORY_FEEDS_DELETE_FAILED');
        }),
        concatMap(() => this.#databaseCategoriesFacadeService.removeCategoryById(categoryId)),
        tap((results) => {
          if (results.error.length > 0) throw new Error('MESSAGE_CATEGORY_DELETE_FAILED');
        }),
        map(() => true),
        take(1),
        catchError((error: Error) => {
          this.#toastService.showError({ key: `${error}` }, 'ERROR', true);
          return of(false);
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe((status) => {
        this.#appStore.setState('blockerLoading', false);
        if (status) {
          this.#router.navigate(['/news']);
          this.#toastService.showSuccess({ key: 'MESSAGE_CATEGORY_DELETE_SUCCESS' });
        }
      });
  }
}
