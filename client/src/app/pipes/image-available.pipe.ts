import { DestroyRef, inject, Pipe, PipeTransform, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

@Pipe({
  name: 'imageAvailable',
  standalone: true,
})
export class ImageAvailablePipe implements PipeTransform {
  readonly #destroyRef = inject(DestroyRef);
  #available = signal<boolean | null>(null);

  public transform(src: string): Signal<boolean | null> {
    const image = new Image();
    fromEvent(image, 'load')
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.#available.set(true));
    fromEvent(image, 'error')
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.#available.set(false));

    image.src = src;

    return this.#available.asReadonly();
  }
}
