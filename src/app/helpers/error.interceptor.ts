import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable, throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
//import { ApiService } from '../services/api/api.service';
//import { EndpointsService } from '../services/api/endpoints.service';
//import { SessionService } from '../services/auth/session.service';

export const ErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const storage = inject(Storage);
  //const apiService = inject(ApiService);
  const deviceService = inject(DeviceDetectorService);
  const platform = inject(Platform);
  //const endpointsService = inject(EndpointsService);
  //const sessionService = inject(SessionService);

  return next(req).pipe(
    catchError((err) => {
      return new Observable<HttpEvent<any>>((observer) => {
        (async () => {
          const dataUser = await storage.get(environment.localStorage);
          const deviceInfo = deviceService.getDeviceInfo();

          const data = {
            admin_id: dataUser?.id ?? -1,
            user_name: dataUser?.name ?? 'Desconocido',
            rol_id: dataUser?.rol_id ?? -1,
            //endpoint: environment.apiUrl + endpointsService.endpoints.log,
            method: 'POST',
            url_origin: window.location.href,
            compilation: getCompilation(platform),
            browser: deviceInfo.browser,
            browser_version: deviceInfo.browser_version,
            device: deviceInfo.device,
            device_type: deviceInfo.deviceType,
            orientation: deviceInfo.orientation,
            os: deviceInfo.os,
            os_version: deviceInfo.os_version,
            admin_version: environment.version,
            description: '' + err.status,
            token: dataUser?.token ?? 'Vacio',
            request: '{}',
            module_origin: '',
            //endpointNew: environment.apiUrl + endpointsService.endpoints.login,
            action: `Solicitud erronea ${err.status} ${err.statusText} ${err.message} ${err.name}`,
          };

          //apiService.post(endpointsService.endpoints.log, data).pipe(first()).subscribe();

          if ([401, 403].includes(err.status)) {
            //sessionService.logout(dataUser?.email);
          } else if (err.statusText === 'Unknown Error') {
            storage.remove(environment.localStorage);
          }

          observer.error(err);
        })();
      });
    })
  );
};

const getCompilation = (platform: Platform) => {
  return platform.is('cordova') || platform.is('capacitor') ? 'admin' : 'browser';
};