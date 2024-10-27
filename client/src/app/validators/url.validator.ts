import { AbstractControl, ValidationErrors } from '@angular/forms';

export const urlValidator = (control: AbstractControl): ValidationErrors | null => {
  if (control.value) {
    if (!`${control.value}`.startsWith('https://')) return { url: true };

    try {
      new URL(control.value);
    } catch {
      return { url: true };
    }
  }

  return null;
};
