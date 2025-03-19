
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
  this.createSurvey();
     return this.http.post<any>(`${environment.apiUrl}/api/modificar_plan`, payload);
  }

  
  createSurvey(): Observable<any> {
    const payload = {
      class_name: 'Español',
      difficulty: 'media',
      enjoyment: 'alta',
      engagement: 'alta',
      topics_of_interest: ['Literatura', 'Gramática', 'Redacción'],
      comments: 'Los estudiantes disfrutan mucho de las clases de Español y encuentran los temas muy interesantes.'
    };
    return this.http.post<any>(`${environment.apiUrl}/survey`, payload);
  }

}
