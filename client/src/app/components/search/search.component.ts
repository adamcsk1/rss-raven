import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NavigationSkipped, NavigationStart, Router } from '@angular/router';
import { searchSlideInFromTopAnimation } from '@components/search/animations/search-slide-in-from-top.animation';
import { appStateToken } from '@stores/app-state.constant';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, filter, Subject } from 'rxjs';

@Component({
  selector: 'rssr-search',
  standalone: true,
  imports: [InputTextModule, FormsModule, ButtonModule, NgxSignalTranslatePipe, AutoFocusModule, InputGroupModule, InputGroupAddonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [searchSlideInFromTopAnimation],
})
export class SearchComponent {
  readonly #destroyRef = inject(DestroyRef);
  readonly #router = inject(Router);
  readonly #appStore = inject(appStateToken);
  readonly #searchTextChanged = new Subject<void>();
  public readonly show = computed(() => this.#appStore.state.search().show);
  public searchText = '';

  constructor() {
    this.#searchTextChanged
      .pipe(
        filter(() => this.searchText.length >= 3),
        debounceTime(500),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(() => this.#appStore.patchState('search', (state) => ({ ...state, text: this.searchText })));

    this.#router.events
      .pipe(
        filter((event) => event instanceof NavigationStart || event instanceof NavigationSkipped),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(() => this.onClose());
  }

  public onSearchTextChanged(): void {
    this.#searchTextChanged.next();
  }

  public onClose(): void {
    this.searchText = '';
    this.#appStore.patchState('search', (state) => ({ ...state, show: false, text: '' }));
  }
}
