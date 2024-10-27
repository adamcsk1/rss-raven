import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PreventVirtualKeyboardDirective } from '@directives/prevent-virtual-keyboard.directive';
import { Settings } from '@interfaces/settings.interface';
import { SettingsLanguageService } from '@pages/settings/settings-language/settings-language.service';
import { languageOptionsFactory } from '@pages/settings/settings-language/utils/options/language-options.util';
import { appStateToken } from '@stores/app-state.constant';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'rssr-settings-language',
  standalone: true,
  imports: [ButtonModule, DropdownModule, FormsModule, PreventVirtualKeyboardDirective, NgxSignalTranslatePipe],
  templateUrl: './settings-language.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SettingsLanguageService],
  host: { class: 'content-container' },
})
export class SettingsLanguageComponent {
  readonly #appStore = inject(appStateToken);
  readonly #settingsLanguageService = inject(SettingsLanguageService);
  public readonly languageOptions = languageOptionsFactory();
  public language: Settings['language'] = 'en';

  constructor() {
    this.#appStore.setState('pageTitle', 'CHANGE_LANGUAGE');
    this.#appStore.setState('pageBackPath', ['/settings', 'list']);
    this.language = this.#appStore.state.settings().language;
  }

  public onSave(): void {
    this.#settingsLanguageService.save(this.language);
  }
}
