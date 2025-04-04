
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

  editCurriculum(): Observable<any> {  
    const updated_data = {
      "course_name": "Español",
      "grade_level": "7",
      "updated_data": {
        "course_name": "Español",
        "grade_level": "7",
        "units": [
          {
            "unit_name": "Comprensión Lectora",
            "objectives": [
              "Desarrollar habilidades de comprensión lectora.",
              "Identificar ideas principales y secundarias en textos narrativos y expositivos.",
              "Analizar y reflexionar sobre el contenido de diferentes tipos de textos."
            ],
            "topics": [
              {
                "topic_name": "Lectura de Textos Narrativos",
                "content": [
                  "Cuentos y fábulas.",
                  "Novelas cortas."
                ],
                "assessment_methods": [
                  "Resúmenes de lectura.",
                  "Preguntas de análisis crítico."
                ]
              },
              {
                "topic_name": "Lectura de Textos Expositivos",
                "content": [
                  "Artículos informativos.",
                  "Ensayos argumentativos."
                ],
                "assessment_methods": [
                  "Mapas conceptuales.",
                  "Preguntas de comprensión."
                ]
              }
            ],
            "resources": [
              "Libros de cuentos y novelas.",
              "Artículos de revistas y periódicos."
            ]
          },
          {
            "unit_name": "Producción Escrita",
            "objectives": [
              "Desarrollar habilidades de escritura creativa y formal.",
              "Aplicar reglas gramaticales y ortográficas en la escritura.",
              "Elaborar textos narrativos, descriptivos y argumentativos."
            ],
            "topics": [
              {
                "topic_name": "Escritura Narrativa",
                "content": [
                  "Estructura de un cuento.",
                  "Creación de personajes y escenarios."
                ],
                "assessment_methods": [
                  "Escritura de cuentos cortos.",
                  "Evaluación de creatividad y coherencia."
                ]
              },
              {
                "topic_name": "Escritura Argumentativa",
                "content": [
                  "Estructura de un ensayo.",
                  "Uso de argumentos y contraargumentos."
                ],
                "assessment_methods": [
                  "Redacción de ensayos.",
                  "Evaluación de claridad y persuasión."
                ]
              }
            ],
            "resources": [
              "Guías de escritura.",
              "Ejercicios de práctica."
            ]
          },
          {
            "unit_name": "Gramática y Ortografía",
            "objectives": [
              "Reconocer y aplicar reglas gramaticales y ortográficas.",
              "Identificar y corregir errores comunes en la escritura.",
              "Ampliar el vocabulario y mejorar la precisión lingüística."
            ],
            "topics": [
              {
                "topic_name": "Reglas Gramaticales",
                "content": [
                  "Uso correcto de tiempos verbales.",
                  "Concordancia entre sujeto y predicado."
                ],
                "assessment_methods": [
                  "Ejercicios de gramática.",
                  "Pruebas de corrección de errores."
                ]
              },
              {
                "topic_name": "Reglas Ortográficas",
                "content": [
                  "Uso correcto de tildes.",
                  "Diferenciación entre palabras homófonas."
                ],
                "assessment_methods": [
                  "Dictados.",
                  "Pruebas de ortografía."
                ]
              }
            ],
            "resources": [
              "Diccionarios y manuales de gramática.",
              "Ejercicios interactivos en línea."
            ]
          }
        ]
      }
    };

    return this.http.post<any>(`${environment.apiUrl}/editCurriculum`, updated_data);
  }

  editCurriculumh(updatedData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/editCurriculum`, updatedData);
  }

  getChatHistory(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/chat/history`);
  }

  getChatMessages(chatId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/chat/${chatId}/messages`);
  }

}
