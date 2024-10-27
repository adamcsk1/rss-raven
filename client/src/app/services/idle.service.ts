import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { combineLatest, debounceTime, fromEvent, startWith } from 'rxjs';

@Injectable()
export class IdleService {
  #document = inject(DOCUMENT);
  #idle = signal(false);
  #initialized = false;
  public readonly idle = this.#idle.asReadonly();

  public initialize(): void {
    if (!this.#initialized) {
      this.#initialized = true;

      combineLatest([fromEvent(this.#document, 'mousemove').pipe(startWith(null)), fromEvent(this.#document, 'touchstart').pipe(startWith(null))])
        .pipe(debounceTime(180000))
        .subscribe(() => this.#idle.set(true));
    }
  }
}
