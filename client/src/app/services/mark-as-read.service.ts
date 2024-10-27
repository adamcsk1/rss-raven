import { inject, Injectable } from '@angular/core';
import { OneNews } from '@interfaces/news.interface';
import { DatabaseNewsFacadeService } from '@services/database/facades/database-news.facade.service';
import { ToastService } from '@services/toast.service';
import { appStateToken } from '@stores/app-state.constant';
import { RxStorageWriteError } from 'rxdb';
import { catchError, of, Subject, take } from 'rxjs';

@Injectable()
export class MarkAsReadService {
  readonly #appStore = inject(appStateToken);
  readonly #databaseNewsFacadeService = inject(DatabaseNewsFacadeService);
  readonly #toastService = inject(ToastService);
  readonly #marked = new Subject<'one' | 'all'>();
  public readonly marked$ = this.#marked.asObservable();

  public mark(): void {
    const newsParameters = this.#appStore.state.newsParameters();

    this.#appStore.setState('spinnerLoading', true);

    if (newsParameters.feedId) {
      this.#databaseNewsFacadeService
        .markAsReadByFeedId(newsParameters.feedId)
        .pipe(take(1))
        .subscribe(({ error }) => this.#handleMarkAllAsReadFinish(error));
    } else if (newsParameters.categoryId) {
      this.#databaseNewsFacadeService
        .markAsReadByCategoryId(newsParameters.categoryId)
        .pipe(take(1))
        .subscribe(({ error }) => this.#handleMarkAllAsReadFinish(error));
    } else {
      this.#databaseNewsFacadeService
        .markAllAsRead()
        .pipe(take(1))
        .subscribe(({ error }) => this.#handleMarkAllAsReadFinish(error));
    }
  }

  public markById(id: string): void {
    this.#databaseNewsFacadeService
      .markAsReadById(id)
      .pipe(
        take(1),
        catchError((error) => {
          this.#toastService.showError({ key: 'MESSAGE_MARK_AS_READ_FAILED' });
          return of(error);
        }),
      )
      .subscribe(() => this.#marked.next('one'));
  }

  #handleMarkAllAsReadFinish(error: RxStorageWriteError<OneNews>[]): void {
    this.#appStore.setState('spinnerLoading', false);
    if (error.length > 0) this.#toastService.showError({ key: 'MESSAGE_MARK_AS_READ_FAILED' });
    else this.#toastService.showSuccess({ key: 'MESSAGE_MARK_AS_READ_SUCCESS' });
    this.#marked.next('all');
  }
}
