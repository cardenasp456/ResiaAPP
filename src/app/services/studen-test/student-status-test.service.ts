// src/app/services/student-status-test.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface SubmissionPayload {
  studentId: string;
  testId: number;
  answers: number[];  // índices 0..3 en el orden de las preguntas
}

export interface SubmissionResult {
  id: number;
  testId: number;
  studentId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  createdAt: string;
  details: Array<{ questionId: number; chosen: number; correct: number; isCorrect: boolean }>;
}

// ===== Tipos (alineados con el backend Flask) =====
export interface CreateTestPayload {
  title: string;
  gradeLevel: string;
  subject: string;
  questions: Array<{
    statement: string;
    options: string[];      // exactamente 4
    correctIndex: number;   // 0..3
  }>;
}

export interface TestOption {
  id: number;
  position: number;
  text: string;
  isCorrect: boolean;
}

export interface TestQuestion {
  id: number;
  position: number;
  statement: string;
  options: TestOption[];
  correctIndex: number;
}

export interface StudentStatusTest {
  id: number;
  title: string;
  gradeLevel: string;
  subject: string;
  createdAt: string;
  questions: TestQuestion[];
}

export interface SubmissionListItem {
  id: number;
  studentId: string;
  createdAt: string;
  score: number;
  totalQuestions: number;
  test: { id: number; title: string; gradeLevel: string; subject: string; };
  analytics?: { overallScore?: number | null };
}

export interface SubmissionListResponse {
  items: SubmissionListItem[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class StudentStatusTestService {
  private http = inject(HttpClient);
  private base = environment.apiUrl?.replace(/\/+$/, '') || '';
  private readonly url = `${this.base}/api/tests`;
  private readonly submissionsUrl = `${this.base}/api/test-submissions/`; 

  createTest(payload: CreateTestPayload): Observable<StudentStatusTest> {
    return this.http.post<StudentStatusTest>(this.url, payload).pipe(
      catchError(this.handleError)
    );
  }

  listTests(): Observable<StudentStatusTest[]> {
    return this.http.get<StudentStatusTest[]>(this.url).pipe(
      catchError(this.handleError)
    );
  }

  getTest(id: number): Observable<StudentStatusTest> {
    return this.http.get<StudentStatusTest>(`${this.url}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse) {
    const msg =
      (err.error && (err.error.error || err.error.detail)) ||
      err.message ||
      'Error de red o servidor.';
    return throwError(() => new Error(msg));
  }

  listByFilters(gradeLevel: string, subject: string) {
    let params = new HttpParams();
    if (gradeLevel) params = params.set('gradeLevel', gradeLevel);
    if (subject)    params = params.set('subject', subject);

    return this.http.get<StudentStatusTest[]>(this.url, { params }).pipe(
      catchError(this.handleError)
    );
  }

   submitTest(payload: SubmissionPayload): Observable<SubmissionResult> {
    return this.http.post<SubmissionResult>(this.submissionsUrl, payload).pipe(
      catchError(this.handleError)
    );
  }

  listSubmissions(filters: { studentId?: string; subject?: string; gradeLevel?: string; page?: number; pageSize?: number; }) {
    let params = new HttpParams();
    Object.entries(filters || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).trim() !== '') {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<SubmissionListResponse>(this.submissionsUrl, { params })
      .pipe(catchError(this.handleError));
  }

  getSubmission(id: number) {
    return this.http.get<any>(`${this.submissionsUrl}${id}`).pipe(
      catchError(this.handleError)
    );
  }
}
