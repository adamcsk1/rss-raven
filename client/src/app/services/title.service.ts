import { effect, inject, Injectable, untracked } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivePathService } from '@services/active-path/active-path.service';
import { appStateToken } from '@stores/app-state.constant';
import { NgxSignalTranslateService } from 'ngx-signal-translate';

@Injectable()
export class TitleService {
  readonly #appStore = inject(appStateToken);
  readonly #signalTranslateService = inject(NgxSignalTranslateService);
  readonly #title = inject(Title);
  readonly #activePathService = inject(ActivePathService);
  #runEffects = false;

  constructor() {
    effect(() => {
      if (!this.#runEffects) return;

      const translatedPageTitle = this.#signalTranslateService.translate(this.#appStore.state.pageTitle());
      const isNewsPage = this.#activePathService.validate('/news', 'includes');
      const translatedAppName = this.#signalTranslateService.translate('APP_NAME');

      if (isNewsPage) untracked(() => this.#title.setTitle(`${translatedPageTitle} - ${translatedAppName}`));
      else untracked(() => this.#title.setTitle(this.#signalTranslateService.translate(translatedAppName)));
    });
  }

  public initialize(): void {
    this.#runEffects = true;
  }
}
