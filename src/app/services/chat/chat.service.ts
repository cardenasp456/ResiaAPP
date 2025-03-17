
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) {}

  modificarPlan(planEstudio: any, encuestas: any): Observable<any> {
     const payload = {
      "model": "llama3.2",
      "messages": [
          {"role": "assistant", "content": "Eres un experto en educación. Aquí tienes un plan de estudios y encuestas de los estudiantes. Usa la información de las encuestas para modificar el plan de estudios."},
      ],
      "format": "json",
      "stream": false,
      "options": {
          "temperature": 0.7
      }
  }
     return this.http.post<any>(`${environment.apiUrl}/api/modificar_plan`, payload);
  }
}
