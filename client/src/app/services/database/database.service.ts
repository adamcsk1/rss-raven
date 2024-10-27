import { effect, inject, Injectable, untracked } from '@angular/core';
import { Settings } from '@interfaces/settings.interface';
import { DatabaseTables } from '@services/database/database.interface';
import { settingsMapper } from '@services/database/mappers/settings.mapper';
import { settingsSelector } from '@services/database/selectors/settings.selector';
import { createDatabase } from '@services/database/utils/create-database.util';
import { appStateToken, initialAppState } from '@stores/app-state.constant';
import { voidResult, voidResult$ } from '@utils/void-return.util';
import { MangoQuerySelectorAndIndex, RxCollection, RxDatabase, RxDocument, RxStorageWriteError } from 'rxdb';
import { catchError, concatMap, filter, from, map, mergeMap, Observable, of, ReplaySubject, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  readonly #appStore = inject(appStateToken);
  #database!: RxDatabase;
  #collections!: {
    feeds: RxCollection;
    news: RxCollection;
    categories: RxCollection;
    settings: RxCollection;
  };
  #initialized = new ReplaySubject<boolean>(1);
  #runEffects = false;

  constructor() {
    effect(() => {
      const settings = this.#appStore.state.settings();

      if (!this.#runEffects) return;

      untracked(() =>
        this.get<Settings>('settings', settingsSelector)
          .pipe(
            mergeMap((settingsDocuments) => settingsDocuments[0].patch(settings)),
            take(1),
          )
          .subscribe(),
      );
    });
  }

  public initialize(): void {
    if (!this.#database) {
      this.#appStore.setState('blockerLoading', true);
      from(createDatabase())
        .pipe(
          tap((createdDatabase) => {
            this.#database = createdDatabase.database;
            this.#collections = createdDatabase.collections;
          }),
          tap(() => this.#initialized.next(true)),
          mergeMap(() => this.getOne<Settings>('settings', settingsSelector).pipe(map(settingsMapper))),
          mergeMap((settings) => {
            if (!settings) return this.insert<Settings>('settings', initialAppState.settings).pipe(map(() => voidResult));
            else {
              this.#appStore.patchState('settings', () => ({ ...initialAppState.settings, ...settings }));
              return voidResult$();
            }
          }),
          take(1),
          map(() => false),
          catchError(() => of(true)),
        )
        .subscribe((hasError: boolean) => {
          if (!hasError) {
            this.#runEffects = true;
            this.#appStore.patchState('blocker', (state) => ({ ...state, dbError: false }));
          } else this.#appStore.patchState('blocker', (state) => ({ ...state, dbError: true }));
          this.#appStore.setState('blockerLoading', false);
        });
    }
  }

  public remove(collection: DatabaseTables): Observable<unknown> {
    return from(this.#collections[collection].remove());
  }

  public insert<T>(collection: DatabaseTables, data: T): Observable<unknown> {
    return from(this.#collections[collection].insert(data));
  }

  public bulkInsert<T>(
    collection: DatabaseTables,
    data: Partial<T>[],
  ): Observable<{
    success: T[];
    error: RxStorageWriteError<T>[];
  }> {
    return this.#initialized.pipe(
      filter((status) => status),
      concatMap(() => from(this.#collections[collection].bulkInsert(data))),
    );
  }

  public getAll<T>(collection: DatabaseTables): Observable<RxDocument<T>[]> {
    return this.#initialized.pipe(
      filter((status) => status),
      concatMap(() => this.#collections[collection].find().$),
    );
  }

  public get<T>(collection: DatabaseTables, query: MangoQuerySelectorAndIndex<T>): Observable<RxDocument<T>[]> {
    return this.#initialized.pipe(
      filter((status) => status),
      concatMap(() => this.#collections[collection].find(query).$),
    );
  }

  public getOne<T>(collection: DatabaseTables, query: MangoQuerySelectorAndIndex<T>): Observable<RxDocument<T>> {
    return this.#initialized.pipe(
      filter((status) => status),
      concatMap(() => this.#collections[collection].findOne(query).$),
    );
  }

  public count<T>(collection: DatabaseTables, query: MangoQuerySelectorAndIndex<T>): Observable<number> {
    return this.#initialized.pipe(
      filter((status) => status),
      concatMap(() => this.#collections[collection].count(query).$),
    );
  }

  public upsert<T>(collection: DatabaseTables, data: Partial<T>): Observable<unknown> {
    return this.#initialized.pipe(
      filter((status) => status),
      concatMap(() => from(this.#collections[collection].upsert(data))),
    );
  }

  public bulkUpsert<T>(
    collection: DatabaseTables,
    data: Partial<T>[],
  ): Observable<{
    success: T[];
    error: RxStorageWriteError<T>[];
  }> {
    return this.#initialized.pipe(
      filter((status) => status),
      concatMap(() => from(this.#collections[collection].bulkUpsert(data))),
    );
  }

  public bulkRemove<T>(
    collection: DatabaseTables,
    ids: string[],
  ): Observable<{
    success: T[];
    error: RxStorageWriteError<T>[];
  }> {
    return this.#initialized.pipe(
      filter((status) => status),
      concatMap(() => from(this.#collections[collection].bulkRemove(ids))),
    );
  }

  public reset(collection: DatabaseTables): Observable<unknown> {
    return this.#initialized.pipe(
      filter((status) => status),
      concatMap(() => from(this.#collections[collection].remove())),
    );
  }
}
