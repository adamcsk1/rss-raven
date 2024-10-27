import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationFacadeService } from '@services/confirmation/confirmation.facade.service';
import { DatabaseCategoriesFacadeService } from '@services/database/facades/database-categories.facade.service';
import { DatabaseFeedsFacadeService } from '@services/database/facades/database-feeds.facade.service';
import { DatabaseNewsFacadeService } from '@services/database/facades/database-news.facade.service';
import { ReloadService } from '@services/reload.service';
import { ToastService } from '@services/toast.service';
import { appStateToken, initialAppState } from '@stores/app-state.constant';
import { catchError, concatMap, map, of, take, tap } from 'rxjs';

@Injectable()
export class SettingsResetService {
  readonly #destroyRef = inject(DestroyRef);
  readonly #appStore = inject(appStateToken);
  readonly #toastService = inject(ToastService);
  readonly #confirmationFacadeService = inject(ConfirmationFacadeService);
  readonly #databaseNewsFacadeService = inject(DatabaseNewsFacadeService);
  readonly #databaseFeedsFacadeService = inject(DatabaseFeedsFacadeService);
  readonly #databaseCategoriesFacadeService = inject(DatabaseCategoriesFacadeService);
  readonly #reloadService = inject(ReloadService);

  public resetNews(): void {
    this.#confirmationFacadeService.confirm({ key: 'CONFIRM_NEWS_DATA_RESET' }, 'RESET_NEWS_DATA', () => this.#resetNews());
  }

  public resetFeeds(): void {
    this.#confirmationFacadeService.confirm({ key: 'CONFIRM_FEED_AND_CATEGORY_DATA_RESET' }, 'RESET_FEED_AND_CATEGORY_DATA', () => this.#resetFeeds());
  }

  public reset(): void {
    this.#confirmationFacadeService.confirm({ key: 'CONFIRM_ALL_DATA_RESET' }, 'RESET_APPLICATION_DATA', () => this.#reset());
  }

  #resetNews(): void {
    this.#appStore.setState('blockerLoading', true);
    this.#databaseNewsFacadeService
      .reset()
      .pipe(
        take(1),
        map(() => true),
        catchError(() => {
          this.#toastService.showError({ key: 'MESSAGE_RESET_ERROR' });
          return of(false);
        }),
        catchError(() => of(false)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(this.#handleResetFinish);
  }

  #resetFeeds(): void {
    this.#appStore.setState('blockerLoading', true);
    this.#databaseNewsFacadeService
      .reset()
      .pipe(
        concatMap(() => this.#databaseFeedsFacadeService.reset()),
        concatMap(() => this.#databaseCategoriesFacadeService.reset()),
        take(1),
        map(() => true),
        catchError(() => {
          this.#toastService.showError({ key: 'MESSAGE_RESET_ERROR' });
          return of(false);
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(this.#handleResetFinish);
  }

  #reset(): void {
    this.#appStore.setState('blockerLoading', true);
    this.#databaseNewsFacadeService
      .reset()
      .pipe(
        concatMap(() => this.#databaseFeedsFacadeService.reset()),
        concatMap(() => this.#databaseCategoriesFacadeService.reset()),
        take(1),
        tap(() => this.#appStore.setState('settings', initialAppState.settings)),
        map(() => true),
        catchError(() => {
          this.#toastService.showError({ key: 'MESSAGE_RESET_ERROR' });
          return of(false);
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(this.#handleResetFinish);
  }

  #handleResetFinish(status: boolean): void {
    this.#appStore.setState('blockerLoading', false);
    if (status) {
      this.#toastService.showSuccess({ key: 'MESSAGE_RESET_SUCCESS' });
      this.#reloadService.reload();
    }
  }
}
