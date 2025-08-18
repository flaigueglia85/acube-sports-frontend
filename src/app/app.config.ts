import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localeIt from '@angular/common/locales/it';
import { ApplicationConfig, LOCALE_ID, NgZone } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import * as heroiconsOutline from '@ng-icons/heroicons/outline';
import { routes } from './app.routes';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { StoreInterceptor } from './core/interceptors/store.interceptor';


registerLocaleData(localeIt); // <-- carica i dati 'it'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: StoreInterceptor,
      multi: true
    },
    provideAnimations(),
    { provide: LOCALE_ID, useValue: 'it-IT' },
    provideIcons(heroiconsOutline)
  ]
};
