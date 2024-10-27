import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SettingsExportService } from '@pages/settings/settings-export/settings-export.service';
import { DownloadService } from '@services/download.service';
import { appStateToken } from '@stores/app-state.constant';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'rssr-settings-export',
  standalone: true,
  imports: [ButtonModule, NgxSignalTranslatePipe],
  templateUrl: './settings-export.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-container' },
  providers: [DownloadService, SettingsExportService],
})
export class SettingsExportComponent {
  readonly #appStore = inject(appStateToken);
  readonly #settingsExportService = inject(SettingsExportService);

  constructor() {
    this.#appStore.setState('pageTitle', 'SETTINGS_EXPORT');
    this.#appStore.setState('pageBackPath', ['/settings', 'list']);
  }

  public onExport(): void {
    this.#settingsExportService.export();
  }
}
