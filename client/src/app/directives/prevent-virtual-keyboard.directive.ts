import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[rssrPreventVirtualKeyboard]',
  standalone: true,
})
export class PreventVirtualKeyboardDirective implements AfterViewInit {
  readonly #elementRef = inject(ElementRef);

  public ngAfterViewInit(): void {
    (this.#elementRef.nativeElement as HTMLElement).querySelector('input')?.setAttribute('inputmode', 'none');
  }
}
