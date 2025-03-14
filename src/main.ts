import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, withHashLocation } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { IonicModule } from '@ionic/angular';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

bootstrapApplication(AppComponent, {
  
  providers: [
    importProvidersFrom(
      IonicModule.forRoot(), 
      FormsModule,
      ReactiveFormsModule,
      IonicModule,
      CommonModule,
    ),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
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
