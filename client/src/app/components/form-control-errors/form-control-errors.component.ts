import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, TemplateRef, contentChild, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { NgxSignalTranslatePipe } from 'ngx-signal-translate';
import { combineLatest, debounceTime } from 'rxjs';

@Component({
  selector: 'rssr-form-control-errors',
  standalone: true,
  imports: [NgTemplateOutlet, NgxSignalTranslatePipe],
  templateUrl: './form-control-errors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormControlErrorsComponent<T> implements AfterViewInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  public readonly control = input.required<FormControl<T>>();
  public readonly controlName = input.required<string>();
  public customErrorsTemplateRef = contentChild<TemplateRef<unknown>>('customErrors');

  public ngAfterViewInit(): void {
    combineLatest([this.control()?.valueChanges, this.control()?.statusChanges])
      .pipe(debounceTime(1000), takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.#changeDetectorRef.markForCheck());
  }
}
