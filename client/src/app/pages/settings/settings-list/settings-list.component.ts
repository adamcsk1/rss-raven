import { KeyValuePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { ListItemDisabledPipe } from '@pages/settings/settings-list/pipes/list-item-disable.pipe';
import { SETTINGS } from '@pages/settings/settings-list/settings-list.constant';
import { Settings, SettingsItem } from '@pages/settings/settings-list/settings-list.interface';
import { appStateToken } from '@stores/app-state.constant';
import { keepKeyOrder } from '@utils/keep-key-order.util';
import { NgxSignalTranslateService } from 'ngx-signal-translate';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'rssr-settings-list',
  standalone: true,
  imports: [KeyValuePipe, ButtonModule, NgClass, ListItemDisabledPipe],
  templateUrl: './settings-list.component.html',
  styleUrl: './settings-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-container' },
})
export class SettingsListComponent {
  readonly #router = inject(Router);
  readonly #appStore = inject(appStateToken);
  readonly #ngxSignalTranslateService = inject(NgxSignalTranslateService);
  public readonly settings = computed(() => {
    let settings: Settings = {};

    for (let [category, items] of Object.entries(SETTINGS)) {
      if (category === 'PROXY' && ['android', 'electron'].includes(environment.type)) continue;

      const translatedKey = this.#ngxSignalTranslateService.translate(category);
      settings[translatedKey] = [];

      for (let item of items) settings[translatedKey].push({ ...item, label: this.#ngxSignalTranslateService.translate(item.label) });
    }

    return settings;
  });

  public readonly keepSettingKeyOrder = keepKeyOrder;

  constructor() {
    this.#appStore.setState('pageTitle', 'SETTINGS');
    this.#appStore.setState('pageBackPath', ['/news']);
  }

  public onClick(item: SettingsItem): void {
    if (item.path) this.#router.navigate(item.path);
  }
}
