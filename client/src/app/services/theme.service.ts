import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import { Settings } from '@interfaces/settings.interface';
import { appStateToken } from '@stores/app-state.constant';
import { fromEvent } from 'rxjs';

@Injectable()
export class ThemeService {
  readonly #appStore = inject(appStateToken);
  readonly #document = inject(DOCUMENT);
  #listened = false;
  #selectedTheme = signal<Settings['theme']>('system');
  #usedTheme = signal<Settings['theme']>('system');
  get #themeLinkElement(): HTMLLinkElement {
    return this.#document.getElementById('app-theme') as HTMLLinkElement;
  }
  get #mediaQuery(): MediaQueryList {
    return window.matchMedia('(prefers-color-scheme: dark)');
  }
  public readonly darkTheme = computed(() => ['dark'].includes(this.#usedTheme()));

  constructor() {
    effect(() => {
      const theme = this.#appStore.state.settings().theme;
      untracked(() => {
        if (theme !== this.#selectedTheme()) this.#switchTheme(theme);
      });
    });
  }

  public listen(): void {
    if (!this.#listened) {
      fromEvent<MediaQueryListEvent>(this.#mediaQuery, 'change').subscribe((event: MediaQueryListEvent) => this.#setSystemTheme(event));
      this.#switchTheme(this.#appStore.state.settings().theme);
      this.#listened = true;
    }
  }

  public setTheme(theme: Settings['theme']): void {
    this.#appStore.patchState('settings', { theme });
    this.#switchTheme(theme);
  }

  #switchTheme(theme: Settings['theme']): void {
    switch (theme) {
      case 'dark':
        return this.#setDarkTheme();
      case 'light':
        return this.#setLightTheme();
      default:
        return this.#setSystemTheme(this.#mediaQuery);
    }
  }

  #setSystemTheme(event: MediaQueryListEvent | MediaQueryList): void {
    if (event.matches) this.#setDarkTheme();
    else this.#setLightTheme();
    this.#selectedTheme.set('system');
  }

  #setDarkTheme(): void {
    if (this.#themeLinkElement) this.#themeLinkElement.href = 'theme-dark.css';
    this.#selectedTheme.set('dark');
    this.#usedTheme.set('dark');
  }

  #setLightTheme(): void {
    if (this.#themeLinkElement) this.#themeLinkElement.href = 'theme-light.css';
    this.#selectedTheme.set('light');
    this.#usedTheme.set('light');
  }
}
