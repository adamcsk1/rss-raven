import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { Settings } from '@interfaces/settings.interface';
import { ToastService } from '@services/toast.service';
import { appStateToken } from '@stores/app-state.constant';

@Injectable()
export class SettingsImportService {
  readonly #appStore = inject(appStateToken);
  readonly #toastService = inject(ToastService);
  readonly #router = inject(Router);

  public import(file: File): void {
    try {
      const reader = new FileReader();
      reader.onload = (event) => this.#importSettings(event);
      reader.readAsText(file);
    } catch {
      this.#toastService.showError({ key: 'MESSAGE_SETTINGS_IMPORT_FAILED' });
    }
  }

  #importSettings(event: ProgressEvent<FileReader>): void {
    try {
      const json = event.target?.result?.toString() || '';
      const settings: Partial<Settings> = JSON.parse(json);

      if (environment.type !== 'browser') settings.proxy = environment.proxy;

      if (
        !Object.prototype.hasOwnProperty.call(settings, 'id') ||
        !Object.prototype.hasOwnProperty.call(settings, 'theme') ||
        !Object.prototype.hasOwnProperty.call(settings, 'language') ||
        !Object.prototype.hasOwnProperty.call(settings.sync, 'syncOnStart') ||
        !Object.prototype.hasOwnProperty.call(settings.sync, 'scrollMarkAsRead') ||
        !Object.prototype.hasOwnProperty.call(settings.sync, 'maximumNewsPerFeed') ||
        !Object.prototype.hasOwnProperty.call(settings.sync, 'backgroundSyncTime') ||
        !Object.prototype.hasOwnProperty.call(settings.proxy, 'basePath') ||
        !Object.prototype.hasOwnProperty.call(settings.proxy, 'token')
      ) {
        throw Error();
      }

      this.#appStore.setState('settings', settings as Settings);
      this.#toastService.showSuccess({ key: 'MESSAGE_SETTINGS_IMPORT_SUCCESS' });
      this.#router.navigate(['/settings', 'list']);
    } catch {
      this.#toastService.showError({ key: 'MESSAGE_SETTINGS_FILE_PROCESSING_FAILED' });
    }
  }
}
