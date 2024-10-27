import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { scaleAnimation } from '@animations/scale.animation';
import { appStateToken } from '@stores/app-state.constant';
import { concatMap, delay, of } from 'rxjs';

@Component({
  selector: 'rssr-spinner-loading',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './spinner-loading.component.html',
  styleUrl: './spinner-loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scaleAnimation],
})
export class SpinnerLoadingComponent {
  readonly #appStore = inject(appStateToken);
  public readonly spinnerLoading$ = toObservable(this.#appStore.state.spinnerLoading).pipe(concatMap((status) => (status ? of(true) : of(false).pipe(delay(250)))));
}
