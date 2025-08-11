import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { routes } from './app.routes';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthGuard } from './core/guard/auth.guard';
import { StoreApiInterceptor } from './core/services/store-api.interceptor';
import { StoreInterceptor } from './core/interceptors/store.interceptor';
import { LOCALE_ID } from '@angular/core';
import localeIt from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroUsers } from '@ng-icons/heroicons/outline';
import { appIconProviders } from './icons.provider';


registerLocaleData(localeIt); // <-- carica i dati 'it'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,withEnabledBlockingInitialNavigation()),
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
    ...appIconProviders 
  ]
};
