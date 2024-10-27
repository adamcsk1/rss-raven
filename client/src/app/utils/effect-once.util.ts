import { effect, untracked } from '@angular/core';

export const effectOnce = (condition: () => boolean, callback: () => void) => {
  const effectRef = effect(() => {
    if (condition()) {
      untracked(() => callback());
      effectRef.destroy();
    }
  });
};
