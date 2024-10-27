import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SettingsImportService } from '@pages/settings/settings-import/settings-import.service';
import { appStateToken } from '@stores/app-state.constant';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { ButtonModule } from 'primeng/button';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'rssr-settings-import',
  standalone: true,
  imports: [ButtonModule, FileUploadModule, NgxSignalTranslatePipe],
  templateUrl: './settings-import.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-container' },
  providers: [SettingsImportService],
})
export class SettingsImportComponent {
  readonly #appStore = inject(appStateToken);
  readonly #settingsImportService = inject(SettingsImportService);
  public get enableImport(): boolean {
    return !!this.#selectedFile;
  }
  public get selectedFileName(): string {
    return this.#selectedFile?.name || '';
  }
  #selectedFile?: File;

  constructor() {
    this.#appStore.setState('pageTitle', 'SETTINGS_IMPORT');
    this.#appStore.setState('pageBackPath', ['/settings', 'list']);
  }

  public onImport(): void {
    this.#settingsImportService.import(this.#selectedFile!);
  }

  public onChoose(event: FileUploadHandlerEvent): void {
    this.#selectedFile = event.files[0];
  }
}
