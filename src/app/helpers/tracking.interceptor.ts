import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpUserEvent,
} from '@angular/common/http';

import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { Observable, catchError, tap, throwError, take } from 'rxjs';
import { LogAppService } from '../services/log-app/log-app.service';
import { environment } from '../../environments/environment';
import { version } from '../../environments/version';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TrackingWordsService } from '../services/tracking-words/tracking-words.service';
import { WordsDictionaryInterface, InterceptorLogInterface } from '../types';

@Injectable()
export class TrackingInterceptor implements HttpInterceptor {
  constructor(
    private logAppService: LogAppService,
    private storage: Storage,
    private platform: Platform,
    private deviceService: DeviceDetectorService,
    private trackingWordsService: TrackingWordsService
  ) {
    this.translate = this.trackingWordsService.words;
    this.keyWordsIncludes = this.trackingWordsService.keyWordsIncludes;
  }

  translate!: WordsDictionaryInterface;
  keyWordsIncludes!: string[];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((data) => {
        if (data.type != 0) {
          this.validateLocal(req, data);
        }
      }),
      catchError((error) => {
        if (error.type != 0) {
          this.validateLocal(req, error);
        }
        return throwError(() => error);
      })
    );
  }

  validateLocal(request: HttpRequest<any>, response: any): void {
    if (!this.validateRequest(request.url)) {
      return;
    }

    this.storage?.get(environment.localStorage).then((user) => {
      try {
        this.getInfo(user, response.status, request);
      } catch (error) {
        this.getInfo(null, response.status, request);
      }
    });
  }

  getInfo(user: { id: any; rol_id: any; token: any; } | null, description: number, request: HttpRequest<any>): void {
    let deviceInfo = this.deviceService.getDeviceInfo();
    let dataResquest = this.getDataRequest(request);
    let moduleNew = window.location.href.split('/').pop();
    let endpointNew = request.url.split('/').slice(-2).join('/');
    let textRequest = JSON.stringify(dataResquest);

    if (endpointNew === 'user/login' && description.toString() != '200') {
      return;
    }

    let dataSend: InterceptorLogInterface = {
      id: user?.id ?? -1,
      user_id: user?.rol_id ?? -1,
      endpoint: request.url,
      method: request.method,
      url_origin: window.location.href,
      compilation: this.getCompilation(),
      browser: deviceInfo.browser,
      browser_version: deviceInfo.browser_version,
      device: deviceInfo.device,
      device_type: deviceInfo.deviceType,
      orientation: deviceInfo.orientation,
      os: deviceInfo.os,
      os_version: deviceInfo.os_version,
      app_version: version.number,
      description: description.toString(),
      token: user?.token ?? 'Vació',
      request: textRequest,
      module_origin: moduleNew,
      endpoint_new: endpointNew,
      action: `${this.getActionFromMethod(request.method, request.url)} ${this.getPropertyValue(endpointNew)}`
    };

    console.log('dataSend:', dataSend);

    if (endpointNew === 'user/forgot-password' && dataSend.token === 'Vació') {
      dataSend.user_id = -1;
      this.sendTracking(dataSend, 'open');
    } else {
      this.sendTracking(dataSend, '');
    }
  }

  validateRequest(url: string): boolean {
    return this.keyWordsIncludes.some((keyword) => url.includes(keyword));
  }

  getDataRequest(request: any): any {
    let response = 'Vacío';

    if (request.body != null) {
      if ('password' in request.body) {
        response = {
          ...request.body,
          password: '********',
          new_password: '*******',
        };
      } else {
        response = request.body;
      }
    }

    return response;
  }

  getActionFromMethod(method: string, url: string): string {
    switch (method) {
      case 'GET':
        return 'Listar';
      case 'POST':
        if (url.includes('login')) {
          return 'Inicio de sesión en';
        }
        return 'Creación de';
      case 'PUT':
        if (url.includes('forgot-password')) {
          return 'Solicitud de olvido de contraseña en';
        } else if (url.includes('change-password')) {
          return 'Cambio de contraseña en';
        }
        return 'Actualización de';
      case 'DELETE':
        return 'Eliminación de';
      default:
        return 'Desconocido';
    }
  }

  getPropertyValue(propertyName: string): string {
    propertyName = propertyName.split('/')[0];
    if (propertyName in this.translate) {
      return this.translate[propertyName][0];
    }
    return propertyName;
  }

  getCompilation(): string {
    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      return 'admin';
    }
    return 'browser';
  }

  sendTracking(data: InterceptorLogInterface, type: string): void {
    if (type === 'open') {
        this.logAppService
        .registerLogOpen(data)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            console.log(res);
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else {
      this.logAppService
      .registerLog(data)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }

  }
}