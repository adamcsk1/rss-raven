import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlErrorsComponent } from '@components/form-control-errors/form-control-errors.component';
import { Form } from '@interfaces/form.interface';
import { Proxy } from '@interfaces/proxy.interface';
import { SettingsProxyService } from '@pages/settings/settings-proxy/settings-proxy.service';
import { endsWithSlashValidator } from '@pages/settings/settings-proxy/validators/ends-with-slash.validator';
import { ProxyService } from '@services/proxy/proxy.service';
import { appStateToken } from '@stores/app-state.constant';
import { urlValidator } from '@validators/url.validator';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'rssr-settings-proxy',
  standalone: true,
  imports: [ButtonModule, InputTextModule, ReactiveFormsModule, FormsModule, FormControlErrorsComponent, DropdownModule, BadgeModule, NgxSignalTranslatePipe],
  templateUrl: './settings-proxy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProxyService, SettingsProxyService],
  host: { class: 'content-container' },
})
export class SettingsProxyComponent implements OnInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #appStore = inject(appStateToken);
  readonly #formBuilder = inject(FormBuilder);
  readonly #settingsProxyService = inject(SettingsProxyService);
  readonly #proxyService = inject(ProxyService);
  readonly #isProxyOnline = signal<boolean | null>(null);
  public readonly formGroup = this.#formBuilder.group<Form<Proxy>>({
    basePath: this.#formBuilder.control('', { nonNullable: true, validators: [Validators.required, endsWithSlashValidator(), urlValidator] }),
    token: this.#formBuilder.control(null),
  });
  public readonly proxyStatus = computed(() => {
    const isProxyOnline = this.#isProxyOnline();
    return isProxyOnline === null ? 'UNKNOWN' : isProxyOnline ? 'ONLINE' : 'OFFLINE';
  });

  constructor() {
    this.#appStore.setState('pageTitle', 'MANGE_PROXY');
    this.#appStore.setState('pageBackPath', ['/settings', 'list']);
  }

  public ngOnInit(): void {
    const settings = this.#appStore.state.settings();

    this.formGroup.patchValue(settings.proxy);

    if (this.formGroup.value.basePath) this.onCheckStatus();
  }

  public onSave(): void {
    this.#settingsProxyService.save(this.formGroup.getRawValue());
  }

  public onCheckStatus(): void {
    this.#proxyService
      .getServerStatus(this.formGroup.getRawValue())
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((status) => this.#isProxyOnline.set(status));
  }
}
