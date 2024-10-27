import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BLOCKER_LOADING_WAIT_MS } from '@components/blocker-loading/blocker-loading.constant';
import { parseOpmlFile } from '@pages/settings/settings-opml-import/utils/parse-opml-file.util';
import { DatabaseCategoriesFacadeService } from '@services/database/facades/database-categories.facade.service';
import { DatabaseFeedsFacadeService } from '@services/database/facades/database-feeds.facade.service';
import { NewsSyncService } from '@services/news-sync/news-sync.service';
import { ToastService } from '@services/toast.service';
import { appStateToken } from '@stores/app-state.constant';
import { asyncScheduler, catchError, combineLatest, concatMap, map, of, take, tap } from 'rxjs';

@Injectable()
export class SettingsOpmlImportService {
  readonly #destroyRef = inject(DestroyRef);
  readonly #appStore = inject(appStateToken);
  readonly #toastService = inject(ToastService);
  readonly #router = inject(Router);
  readonly #databaseCategoriesFacadeService = inject(DatabaseCategoriesFacadeService);
  readonly #databaseFeedsFacadeService = inject(DatabaseFeedsFacadeService);
  readonly #newsSyncService = inject(NewsSyncService);

  public import(file: File): void {
    try {
      this.#appStore.setState('blockerLoading', true);
      const reader = new FileReader();
      asyncScheduler.schedule(() => {
        reader.onload = (event) => this.#importContent(event);
        reader.readAsText(file);
      }, BLOCKER_LOADING_WAIT_MS + 100);
    } catch {
      this.#toastService.showError({ key: 'MESSAGE_OPML_IMPORT_FAILED' });
    }
  }

  #importContent(event: ProgressEvent<FileReader>): void {
    try {
      const xml = event.target?.result?.toString() || '';
      const { categories, feeds } = parseOpmlFile(xml);

      if (feeds.length === 0) this.#toastService.showError({ key: 'MESSAGE_OPML_FILE_EMPTY' });
      else {
        combineLatest([this.#databaseFeedsFacadeService.feeds$.pipe(map((feeds) => feeds.map((feed) => feed.url))), this.#databaseCategoriesFacadeService.insertCategories(categories)])
          .pipe(
            tap(([, results]) => {
              if (results.error.length > 0) throw new Error('MESSAGE_CATEGORY_CREATE_FAILED');
            }),
            concatMap(([knownFeedUrls]) => this.#databaseFeedsFacadeService.insertFeeds(feeds.filter((feed) => !knownFeedUrls.includes(feed.url)))),
            tap((results) => {
              if (results.error.length > 0) throw new Error('MESSAGE_FEED_CREATE_FAILED');
            }),
            map(() => true),
            take(1),
            catchError((error: Error) => {
              this.#toastService.showError({ key: `${error}` }, 'ERROR', true);
              return of(false);
            }),
            takeUntilDestroyed(this.#destroyRef),
          )
          .subscribe((success) => {
            this.#appStore.setState('blockerLoading', false);
            if (success) {
              this.#toastService.showSuccess({ key: 'MESSAGE_OPML_IMPORT_SUCCESS' });
              this.#newsSyncService.sync({ syncType: 'all' });
              this.#router.navigate(['/news']);
            }
          });
      }
    } catch {
      this.#appStore.setState('blockerLoading', false);
      this.#toastService.showError({ key: 'MESSAGE_OPML_FILE_PROCESSING_FAILED' });
    }
  }
}
