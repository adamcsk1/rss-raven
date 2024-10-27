import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreventVirtualKeyboardDirective } from '@directives/prevent-virtual-keyboard.directive';
import { environment } from '@environments/environment';
import { Form } from '@interfaces/form.interface';
import { SettingsSync } from '@pages/settings/settings-sync/settings-sync.interface';
import { SettingsSyncService } from '@pages/settings/settings-sync/settings-sync.service';
import { backgroundSyncOptionsFactory } from '@pages/settings/settings-sync/utils/options/background-sync-options.util';
import { maximumFeedNewsOptionsFactory } from '@pages/settings/settings-sync/utils/options/maximum-feed-news-options.util';
import { appStateToken, initialAppState } from '@stores/app-state.constant';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'rssr-settings-sync',
  standalone: true,
  imports: [ButtonModule, ReactiveFormsModule, FormsModule, DropdownModule, PreventVirtualKeyboardDirective, CheckboxModule, NgxSignalTranslatePipe],
  templateUrl: './settings-sync.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SettingsSyncService],
  host: { class: 'content-container' },
})
export class SettingsSyncComponent implements OnInit {
  readonly #appStore = inject(appStateToken);
  readonly #formBuilder = inject(FormBuilder);
  readonly #settingsSyncService = inject(SettingsSyncService);
  public readonly showBackgroundSync = environment.type === 'android';
  public readonly maximumFeedNewsOptions = maximumFeedNewsOptionsFactory();
  public readonly backgroundSyncOptions = backgroundSyncOptionsFactory();
  public readonly formGroup = this.#formBuilder.group<Form<SettingsSync>>({
    syncOnStart: this.#formBuilder.control(initialAppState.settings.sync.syncOnStart, { nonNullable: true }),
    scrollMarkAsRead: this.#formBuilder.control(initialAppState.settings.sync.scrollMarkAsRead, { nonNullable: true }),
    maximumNewsPerFeed: this.#formBuilder.control(initialAppState.settings.sync.maximumNewsPerFeed, { nonNullable: true }),
    backgroundSyncTime: this.#formBuilder.control(initialAppState.settings.sync.backgroundSyncTime, { nonNullable: true }),
  });

  constructor() {
    this.#appStore.setState('pageTitle', 'SYNC_PREFERENCES');
    this.#appStore.setState('pageBackPath', ['/settings', 'list']);
  }

  public ngOnInit(): void {
    const settings = this.#appStore.state.settings();
    this.formGroup.patchValue(settings.sync);
  }

  public onSave(): void {
    this.#settingsSyncService.save(this.formGroup.getRawValue());
  }
}
