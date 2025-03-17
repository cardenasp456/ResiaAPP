import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler } from "@angular/common/http";
import { Storage } from "@ionic/storage";
import { environment } from "../../environments/environment";
import { from, Observable, lastValueFrom } from "rxjs";

@Injectable()
export class JwtInterceptor {
    private token: string | null = null;

    constructor(private storage: Storage) {}
    async init() {
      try {
          await this.storage.create();
      } catch (error) {
          console.log("Error en JwtInterceptorService " + error);
      }
  }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        const isApiUrl = request.url.startsWith(environment.apiUrl);

        if (isApiUrl) {
            return from(this.handle(request, next));
        }
        return next.handle(request);
    }


    async handle(request: HttpRequest<any>, next: HttpHandler): Promise<any> {
      await this.init();

        await this.init();

        const token = await this.storage.get(environment.localStorage);;

        if(token) {
            this.token = token?.token || null;
        }

        if(this.token) {
            const authReq = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.token}`
                }
            });
            return await lastValueFrom(next.handle(authReq));
        } else {
            return await lastValueFrom(next.handle(request));
        }
    }
}