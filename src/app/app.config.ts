import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, withHashLocation } from '@angular/router';
import { IonicRouteStrategy, ModalController} from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';
import { importProvidersFrom } from '@angular/core';
import {  withInterceptorsFromDi, HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { TrackingInterceptor } from './helpers/tracking.interceptor';
import { LoadingInterceptor } from './helpers/loading.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
      importProvidersFrom(
        IonicModule.forRoot(), 
        IonicStorageModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        CommonModule,
      ),
      provideHttpClient(),
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: TrackingInterceptor, multi: true },
      provideRouter(
        routes, 
        withPreloading(PreloadAllModules), 
        withHashLocation()
      ),
      provideAnimationsAsync(), 
      providePrimeNG({
        theme: { 
          preset: Aura,
          options: {
            darkModeSelector: true
          }
        }
      }),
      ModalController,
    ],
  }