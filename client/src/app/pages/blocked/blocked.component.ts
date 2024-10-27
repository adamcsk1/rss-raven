import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { appStateToken } from '@stores/app-state.constant';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { asyncScheduler } from 'rxjs';

@Component({
  selector: 'rssr-blocked',
  standalone: true,
  templateUrl: './blocked.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxSignalTranslatePipe],
})
export class BlockedComponent {
  readonly #appStore = inject(appStateToken);
  readonly #router = inject(Router);
  public readonly errors = computed(() => this.#appStore.state.blocker().errors);

  constructor() {
    asyncScheduler.schedule(() => {
      if (!this.#appStore.state.blocker().blocked) this.#router.navigate(['/news']);
    }, 1000);
  }
}
