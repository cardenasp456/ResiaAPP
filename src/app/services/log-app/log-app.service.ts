import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { InterceptorLogInterface } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class LogAppService {

  constructor(
    private http: HttpClient
  ) { }

  registerLog(data:InterceptorLogInterface) {
    return this.http.post<any>(`${environment.apiUrl}/UserLog/insert-user-log`, data);
  }

  registerLogOpen(data:InterceptorLogInterface) {
    return this.http.post<any>(`${environment.apiUrl}/userLog/insert-user-log`, data);
  }
}
