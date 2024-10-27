import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export const conditionalRequiredValidator =
  (condition: () => boolean): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null =>
    condition() ? Validators.required(control) : null;
