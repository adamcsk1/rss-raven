import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SettingsOpmlExportService } from '@pages/settings/settings-opml-export/settings-opml-export.service';
import { DownloadService } from '@services/download.service';
import { appStateToken } from '@stores/app-state.constant';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'rssr-settings-opml-export',
  standalone: true,
  imports: [ButtonModule, NgxSignalTranslatePipe],
  templateUrl: './settings-opml-export.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-container' },
  providers: [DownloadService, SettingsOpmlExportService],
})
export class SettingsOpmlExportComponent {
  readonly #appStore = inject(appStateToken);
  readonly #settingsOpmlExportService = inject(SettingsOpmlExportService);

  constructor() {
    this.#appStore.setState('pageTitle', 'OPML_EXPORT');
    this.#appStore.setState('pageBackPath', ['/settings', 'list']);
  }

  public onExport(): void {
    this.#settingsOpmlExportService.export();
  }
}
