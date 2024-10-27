import { DOCUMENT, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'rssr-root',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  readonly #document = inject(DOCUMENT);
  readonly #location = inject(Location);
  readonly #viewContainerRef = inject(ViewContainerRef);

  constructor() {
    if (this.#location.path().endsWith('/background-sync')) this.#loadLazyMainBackgroundSync();
    else this.#loadLazyMainContent();
  }

  async #loadLazyMainContent(): Promise<void> {
    (this.#document.getElementById('app-style') as HTMLLinkElement).href = 'styles.css';
    (this.#document.getElementById('app-theme') as HTMLLinkElement).href = 'theme-light.css';
    this.#viewContainerRef.clear();
    const { MainContentComponent } = await import('./main-content/main-content.component');
    this.#viewContainerRef.createComponent(MainContentComponent);
  }

  async #loadLazyMainBackgroundSync(): Promise<void> {
    this.#viewContainerRef.clear();
    const { MainBackgroundSyncComponent } = await import('./main-background-sync/main-background-sync.component');
    this.#viewContainerRef.createComponent(MainBackgroundSyncComponent);
  }
}
