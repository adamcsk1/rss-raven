import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { APP_VERSION, BUILD, BUILD_DATE } from '@appConstant';
import { LogoAutoContrastDirective } from '@directives/logo-auto-contrast.directive';
import { environment } from '@environments/environment';
import { appStateToken } from '@stores/app-state.constant';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';

@Component({
  selector: 'rssr-about',
  standalone: true,
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoAutoContrastDirective, NgxSignalTranslatePipe],
  host: { class: 'content-container' },
})
export class AboutComponent {
  readonly #appStore = inject(appStateToken);
  public readonly build = BUILD;
  public readonly buildDate = BUILD_DATE;
  public readonly appVersion = APP_VERSION;
  public readonly environmentType = environment.type;

  constructor() {
    this.#appStore.setState('pageTitle', 'ABOUT');
    this.#appStore.setState('pageBackPath', ['/settings', 'list']);
  }
}
