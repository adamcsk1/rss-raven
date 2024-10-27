import { Directive, effect, ElementRef, inject, Renderer2 } from '@angular/core';
import { ThemeService } from '@services/theme.service';

@Directive({
  selector: '[rssrLogoAutoContrast]',
  standalone: true,
})
export class LogoAutoContrastDirective {
  readonly #themeService = inject(ThemeService);
  readonly #elementRef = inject(ElementRef);
  readonly #renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const darkTheme = this.#themeService.darkTheme();
      if (darkTheme) this.#renderer.addClass(this.#elementRef.nativeElement, 'logo-light-mask');
      else this.#renderer.removeClass(this.#elementRef.nativeElement, 'logo-light-mask');
    });
  }
}
