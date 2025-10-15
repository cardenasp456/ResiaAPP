import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ModalController,
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonList, IonItem, IonLabel, IonInput, IonFooter,
  IonSelect, IonSelectOption,
  IonProgressBar, IonRadioGroup, IonRadio
} from '@ionic/angular/standalone';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { StudentStatusTest, StudentStatusTestService } from '../../../services/studen-test/student-status-test.service';
import { IonCard } from '@ionic/angular';
import { RadarAnalyticsModalComponent } from '../radar-analytics-modal/radar-analytics-modal.component';

// Pipe para mostrar A, B, C, D a partir de 0..3
@Pipe({ name: 'letterA', standalone: true })
export class LetterAPipe implements PipeTransform {
  transform(idx: number | null | undefined): string {
    const letters = ['A', 'B', 'C', 'D'];
    return (typeof idx === 'number' && idx >= 0 && idx < letters.length) ? letters[idx] : '';
  }
}

type StatusForm = FormGroup<{
  studentId: FormControl<string>;
  gradeLevel: FormControl<string>;
  subject: FormControl<string>;
}>;

@Component({
  selector: 'app-student-status-test-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule, FormsModule, CommonModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonList, IonItem, IonLabel, IonInput, IonFooter,
    IonSelect, IonSelectOption,
    IonProgressBar, IonRadioGroup, IonRadio,
    ButtonModule, CardModule,
    LetterAPipe,
  ],
  templateUrl: './student-status-test-modal.component.html',
  styleUrls: ['./student-status-test-modal.component.scss']
})
export class StudentStatusTestModalComponent implements OnInit, OnDestroy {
  @Input() statusData?: any;
  @Input() mode: 'start' | 'check' = 'start';

  grades = ['6', '7', '8', '9', '10', '11'];
  subjects = ['Español', 'Matemáticas', 'Sociales', 'Naturales', 'Artes', 'Música', 'Geometría'];

  form: StatusForm;
  isStart = true;

  tests: StudentStatusTest[] = [];
  loading = false;
  error?: string;
  private sub?: Subscription;

  // ===== Runner de prueba =====
  activeTest?: StudentStatusTest;  // prueba seleccionada
  answers: number[] = [];          // respuesta por pregunta (position), -1 si no contestada
  current = 0;                     // índice de pregunta activa

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private testsService: StudentStatusTestService
  ) {
    this.form = this.fb.nonNullable.group({
      studentId: this.fb.nonNullable.control('', { validators: [Validators.required] }),
      gradeLevel: this.fb.nonNullable.control('7', { validators: [Validators.required] }),
      subject: this.fb.nonNullable.control('Matemáticas', { validators: [Validators.required] })
    });
  }

  ngOnInit() {
    this.isStart = (this.mode || 'start').toString().trim().toLowerCase() === 'start';

    // primer fetch + react a cambios de grado/materia
    this.loadTests();
    this.sub = this.form.valueChanges
      .pipe(debounceTime(150))
      .subscribe(() => this.loadTests());
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }

  // ===== Listado
  private loadTests() {
    // si ya estás dentro de una prueba, no refrescar el listado
    if (this.activeTest) return;

    const { gradeLevel, subject } = this.form.getRawValue();
    if (!gradeLevel || !subject) {
      this.tests = [];
      return;
    }

    this.loading = true;
    this.error = undefined;
    this.testsService.listByFilters(gradeLevel, subject).subscribe({
      next: (tests) => { this.tests = tests || []; this.loading = false; },
      error: (e) => { this.error = e?.message || 'No se pudieron cargar las pruebas.'; this.tests = []; this.loading = false; }
    });
  }

  pickTest(t: StudentStatusTest) {
    this.activeTest = t;
    const n = t?.questions?.length ?? 0;
    this.answers = Array(n).fill(-1);
    this.current = 0;
  }

  cancelTest() {
    this.activeTest = undefined;
    this.answers = [];
    this.current = 0;
    // refresca lista por si algo cambió
    this.loadTests();
  }

  // ===== Navegación / cálculo
  get total(): number { return this.activeTest?.questions?.length ?? 0; }
  get currentQuestion() { return this.activeTest?.questions?.[this.current]; }

  trackByOption = (_: number, opt: { id: number; position: number }) => opt?.id ?? opt?.position ?? _;

  prev() { if (this.current > 0) this.current--; }
  next() { if (this.current < this.total - 1) this.current++; }

  canFinish(): boolean {
    return !!this.activeTest && this.answers.length === this.total && this.answers.every(a => Number(a) >= 0);
  }

  submitting = false;

  async finish() {
  if (!this.activeTest || !this.canFinish()) return;

  const studentId = this.form.get('studentId')!.value;
  const testId = this.activeTest.id;
  const answers = this.answers.map(a => Number(a));

  this.submitting = true;

  this.testsService.submitTest({ studentId, testId, answers }).subscribe({
    next: async (res) => {
      this.submitting = false;

      // Abre el modal del radar con el resultado recibido del back
      const modal = await this.modalCtrl.create({
        component: RadarAnalyticsModalComponent,
        componentProps: { result: res },   // res.analytics.radar ya viene dentro
        cssClass: 'radar-modal'            // opcional (tamaño/estilo)
      });
      await modal.present();

      // (Opcional) cuando se cierre el radar, cierra también este modal y
      // devuelve el resultado al padre:
      // const { role } = await modal.onWillDismiss();
      // this.modalCtrl.dismiss({ action: 'submitTest', result: res }, 'confirm');
    },
    error: (e) => {
      console.error(e);
      this.submitting = false;
      // (opcional) muestra un toast de error
    }
  });
}

  // Mantén tu submit() original para el flujo "start"/"check" sin selección de prueba
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue(); // { studentId, gradeLevel, subject }
    const action = this.mode === 'start' ? 'start' : 'check';
    this.modalCtrl.dismiss({ action, payload });
  }

   close() { this.modalCtrl.dismiss(null, 'cancel'); }
}
