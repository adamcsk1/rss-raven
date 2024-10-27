import { isDevMode } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { environment } from '@environments/environment';

export const backgroundSyncGuard: CanActivateFn = (): boolean => environment.type === 'android' || isDevMode();
