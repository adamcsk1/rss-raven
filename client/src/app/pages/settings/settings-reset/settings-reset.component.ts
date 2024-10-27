import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SettingsResetService } from '@pages/settings/settings-reset/settings-reset.service';
import { ConfirmationFacadeService } from '@services/confirmation/confirmation.facade.service';
import { ReloadService } from '@services/reload.service';
import { appStateToken } from '@stores/app-state.constant';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'rssr-settings-reset',
  standalone: true,
  imports: [ButtonModule, FileUploadModule, NgxSignalTranslatePipe],
  templateUrl: './settings-reset.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-container' },
  providers: [ReloadService, ConfirmationFacadeService, SettingsResetService],
})
export class SettingsResetComponent {
  readonly #appStore = inject(appStateToken);
  readonly #settingsResetService = inject(SettingsResetService);

  constructor() {
    this.#appStore.setState('pageTitle', 'RESET_APPLICATION_DATA');
    this.#appStore.setState('pageBackPath', ['/settings', 'list']);
  }

  public onResetNews(): void {
    this.#settingsResetService.resetNews();
  }

  public onResetFeeds(): void {
    this.#settingsResetService.resetFeeds();
  }

  public onReset(): void {
    this.#settingsResetService.reset();
  }
}
