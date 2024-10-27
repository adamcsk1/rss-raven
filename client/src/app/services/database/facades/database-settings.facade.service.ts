import { inject, Injectable } from '@angular/core';
import { Settings } from '@interfaces/settings.interface';
import { DatabaseService } from '@services/database/database.service';
import { settingsSelector } from '@services/database/selectors/settings.selector';
import { RxDocument } from 'rxdb';
import { mergeMap, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseSettingsFacadeService {
  readonly #databaseService = inject(DatabaseService);

  public patchSettings(settings: Settings): Observable<RxDocument<Settings>> {
    return this.#databaseService.getOne<Settings>('settings', settingsSelector).pipe(mergeMap((settingsDocument) => settingsDocument.patch(settings)));
  }
}
