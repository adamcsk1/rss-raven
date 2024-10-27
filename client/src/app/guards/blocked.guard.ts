import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { appStateToken } from '@stores/app-state.constant';

export const blockedGuard: CanActivateFn = (): boolean => {
  const appStore = inject(appStateToken);
  return !appStore.state.blocker().blocked;
};
