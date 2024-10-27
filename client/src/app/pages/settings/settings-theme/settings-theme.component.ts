import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PreventVirtualKeyboardDirective } from '@directives/prevent-virtual-keyboard.directive';
import { Settings } from '@interfaces/settings.interface';
import { SettingsThemeService } from '@pages/settings/settings-theme/settings-theme.service';
import { themeOptionsFactory } from '@pages/settings/settings-theme/utils/options/theme-options.util';
import { appStateToken } from '@stores/app-state.constant';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'rssr-settings-theme',
  standalone: true,
  imports: [ButtonModule, DropdownModule, FormsModule, PreventVirtualKeyboardDirective, NgxSignalTranslatePipe],
  templateUrl: './settings-theme.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SettingsThemeService],
  host: { class: 'content-container' },
})
export class SettingsThemeComponent {
  readonly #appStore = inject(appStateToken);
  readonly #settingsThemeService = inject(SettingsThemeService);
  public readonly themeOptions = themeOptionsFactory();
  public theme: Settings['theme'] = 'system';

  constructor() {
    this.#appStore.setState('pageTitle', 'CHANGE_THEME');
    this.#appStore.setState('pageBackPath', ['/settings', 'list']);
    this.theme = this.#appStore.state.settings().theme;
  }

  public onSave(): void {
    this.#settingsThemeService.save(this.theme);
  }
}
