
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getCurriculum(data: { course_name: string; grade_level: string }): Observable<any> {
    const params = new HttpParams()
      .set('course_name', data.course_name)
      .set('grade_level', data.grade_level);
  
    return this.http.get<any>(`${environment.apiUrl}/curriculum`, { params });
  }
  
  createSurvey(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/survey`, payload);
  }

  getAllSurveys(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/surveys`);
  }

  deleteSurvey(data: { summary_id: number; subject: string }): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/deleteSurvey`, data);
  }

}
