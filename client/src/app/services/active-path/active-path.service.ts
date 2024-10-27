import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { ActivePathMode } from '@services/active-path/active-path.interface';
import { filter, map, startWith } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ActivePathService {
  readonly #router = inject(Router);
  public readonly activePath = toSignal(
    this.#router.events.pipe(
      startWith(this.#router.url),
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.#router.url),
    ),
  );

  public validate(targetUrlPart: string, mode: ActivePathMode = 'endsWith'): boolean {
    const url = this.activePath() || '';
    switch (mode) {
      case 'includes':
        return url.includes(targetUrlPart);
      case 'endsWith':
      default:
        return url.endsWith(targetUrlPart);
    }
  }
}
