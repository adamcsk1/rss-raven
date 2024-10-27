import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Settings } from '@interfaces/settings.interface';
import { DownloadService } from '@services/download.service';
import { appStateToken } from '@stores/app-state.constant';

@Injectable()
export class SettingsExportService {
  readonly #appStore = inject(appStateToken);
  readonly #downloadService = inject(DownloadService);

  public export(): void {
    const settings: Partial<Settings> = this.#appStore.state.settings();
    if (environment.type !== 'browser') delete settings.proxy;
    this.#downloadService.saveAs(JSON.stringify(settings, null, 2), 'settings-export', 'json');
  }
}
