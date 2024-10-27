import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SettingsOpmlImportService } from '@pages/settings/settings-opml-import/settings-opml-import.service';
import { appStateToken } from '@stores/app-state.constant';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { ButtonModule } from 'primeng/button';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'rssr-settings-opml-import',
  standalone: true,
  imports: [ButtonModule, FileUploadModule, NgxSignalTranslatePipe],
  templateUrl: './settings-opml-import.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-container' },
  providers: [SettingsOpmlImportService],
})
export class SettingsOpmlImportComponent {
  readonly #appStore = inject(appStateToken);
  readonly #settingsOpmlImportService = inject(SettingsOpmlImportService);
  public get enableImport(): boolean {
    return !!this.#selectedFile;
  }
  public get selectedFileName(): string {
    return this.#selectedFile?.name || '';
  }
  #selectedFile?: File;

  constructor() {
    this.#appStore.setState('pageTitle', 'OPML_IMPORT');
    this.#appStore.setState('pageBackPath', ['/settings', 'list']);
  }

  public onImport(): void {
    this.#settingsOpmlImportService.import(this.#selectedFile!);
  }

  public onChoose(event: FileUploadHandlerEvent): void {
    this.#selectedFile = event.files[0];
  }
}
