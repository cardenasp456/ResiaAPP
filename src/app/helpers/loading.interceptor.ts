import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { finalize, switchMap } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    private urlsToNotUseInterceptor: string[] = [
        '/UserLog/insert-user-log',
    ];

    constructor(public loadingController: LoadingController) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (this.urlsToNotUseInterceptor.some((url) => request.url.includes(url))) {
            // Si la URL está en la lista de exclusiones, pasa la petición directamente.
            return next.handle(request);
        } else {
            // Usar from para convertir la promesa de loadingController.create() a un observable.
            return from(
                this.loadingController.create({
                    message: 'Espera por favor...',
                })
            ).pipe(
                switchMap((loading) => {
                    // Mostrar el loading.
                    loading.present();

                    return next.handle(request).pipe(
                        finalize(async () => await loading.dismiss())
                    );
                })
            );
        }
    }
}