import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject } from '@angular/core';
import { BLOCKER_LOADING_WAIT_MS } from '@components/blocker-loading/blocker-loading.constant';
import { LogoAutoContrastDirective } from '@directives/logo-auto-contrast.directive';
import { appStateToken } from '@stores/app-state.constant';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { BlockUIModule } from 'primeng/blockui';
import { asyncScheduler, Subscription } from 'rxjs';

@Component({
  selector: 'rssr-blocker-loading',
  standalone: true,
  imports: [BlockUIModule, LogoAutoContrastDirective, NgxSignalTranslatePipe],
  templateUrl: './blocker-loading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockerLoadingComponent {
  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #appStore = inject(appStateToken);
  #startTime: number | null = null;
  #scheduler?: Subscription;
  public showBlockerLoading = false;

  constructor() {
    effect(() => {
      const blockerLoading = this.#appStore.state.blockerLoading();
      if (blockerLoading) {
        this.#startTime = new Date().getTime();

        this.#scheduler = asyncScheduler.schedule(() => {
          if (blockerLoading) {
            this.showBlockerLoading = true;
            this.#changeDetectorRef.markForCheck();
          } else this.#startTime = null;
        }, BLOCKER_LOADING_WAIT_MS);
      }

      if (!blockerLoading && this.#startTime) {
        this.#scheduler?.unsubscribe();
        this.showBlockerLoading = false;
        this.#changeDetectorRef.markForCheck();
        this.#startTime = null;
      }
    });
  }
}
