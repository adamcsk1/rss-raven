import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const endsWithSlashValidator =
  (): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null =>
    !!control.value && !`${control.value}`.endsWith('/') ? { endsWithSlash: true } : null;
