import { isDevMode } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { environment } from '@environments/environment';

export const proxySettingsGuard: CanActivateFn = (): boolean => environment.type === 'browser' || isDevMode();
