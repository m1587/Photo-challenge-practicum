import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { tokenInterceptor } from '../shared/token/token.interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [provideCharts(withDefaultRegisterables()),provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([tokenInterceptor]),withInterceptorsFromDi()
  ),
   provideAnimations(), // ✅ הוספת תמיכה באנימציות
   provideCharts(withDefaultRegisterables()), // ✅ גרפים
  ]
};