import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withHashLocation, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { routes } from '@appRoutes';
import { environment } from '@environments/environment';
import { appStateToken, initialAppState } from '@stores/app-state.constant';
import { provideSignalTranslateConfig } from 'ngx-signal-translate';
import { provideStore } from 'ngx-simple-signal-store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
      withViewTransitions(),
      withHashLocation(),
    ),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideStore(initialAppState, appStateToken),
    provideSignalTranslateConfig({ path: environment.languageFilePath }),
  ],
};
