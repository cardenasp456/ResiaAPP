import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, withHashLocation } from '@angular/router';
import { IonicRouteStrategy, ModalController, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AppComponent } from './app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JwtInterceptor } from './app/helpers/jwt.interceptor';
import { LoadingInterceptor } from './app/helpers/loading.interceptor';
import { TrackingInterceptor } from './app/helpers/tracking.interceptor';
import { IonicModule } from '@ionic/angular';
import { appConfig } from './app/app.config';


bootstrapApplication(AppComponent, {
  
    providers: [
      importProvidersFrom(
        IonicModule.forRoot(), 
        IonicStorageModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        CommonModule,
      ),
      provideHttpClient(withInterceptorsFromDi()),
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: TrackingInterceptor, multi: true },
      provideIonicAngular(),
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
      })
    ],
  });
