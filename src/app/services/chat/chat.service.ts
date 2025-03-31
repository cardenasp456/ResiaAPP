
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) {}

  modificarPlan(subject: any, search: any): Observable<any> {
     const payload = {
      'subject': subject,
      'search': search
    }
     return this.http.post<any>(`${environment.apiUrl}/api/modificar_plan`, payload);
  }

  
  createSurvey(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/survey`, payload);
  }

}
