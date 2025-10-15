import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CreateTestPayload, StudentStatusTest, StudentStatusTestService } from '../../../services/studen-test/student-status-test.service';
import { firstValueFrom } from 'rxjs';

interface OptionModel { id: number; text: string; }
interface QuestionModel {
  statement: string;
  options: OptionModel[];   // <— ahora objetos
  correctIndex: number;     // 0..3
}

interface TestFormModel {
  title: string;
  gradeLevel: string;
  subject: string;
  questions: QuestionModel[];
}

@Component({
  selector: 'app-create-student-status-test-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
   templateUrl: './create-student-test-modal.component.html',
  styleUrls: ['./create-student-test-modal.component.scss']
})
export class CreateStudentTestModalComponent {
  grades = ['6', '7', '8', '9', '10', '11'];
  subjects = ['Español', 'Matemáticas', 'Sociales', 'Naturales', 'Artes', 'Música', 'Geometría'];
  readonly maxQuestions = 10;

  
  private testsService = inject(StudentStatusTestService);
  private toastCtrl = inject(ToastController);

  
  trackByOption = (_: number, opt: OptionModel) => opt.id;

  submitting = false;

  model: TestFormModel = {
    title: '',
    gradeLevel: '',
    subject: '',
    questions: [this.newQuestion()]
  };

  constructor(private modalCtrl: ModalController) {}

  // ---- UI helpers ----
  trackByIndex = (_: number, __: any) => _;
  remainingQuestions(): number {
    return this.maxQuestions - this.model.questions.length;
  }
  canAddQuestion(): boolean {
    return this.model.questions.length < this.maxQuestions;
  }

  // ---- Questions ----
  private newQuestion(): QuestionModel {
  return {
    statement: '',
    options: [
      { id: 0, text: '' },
      { id: 1, text: '' },
      { id: 2, text: '' },
      { id: 3, text: '' },
    ],
    correctIndex: 0
  };
}
  addQuestion() {
    if (this.canAddQuestion()) this.model.questions.push(this.newQuestion());
  }
  removeQuestion(index: number) {
    if (this.model.questions.length > 1) this.model.questions.splice(index, 1);
  }

  // ---- Validation ----
  isInvalid(): boolean {
  const m = this.model;

  // Campos principales
  if (!m.title?.trim() || !m.gradeLevel || !m.subject) return true;

  // Cantidad de preguntas
  if (!Array.isArray(m.questions) || m.questions.length === 0 || m.questions.length > this.maxQuestions) {
    return true;
  }

  // Reglas por pregunta
  return m.questions.some(q => {
    const idx = Number(q.correctIndex);                    // coerción a number SIEMPRE
    const hasEmptyStatement = !q.statement || !q.statement.trim();

    // q.options debe existir y tener 4
    const wrongOptionsCount = !Array.isArray(q.options) || q.options.length !== 4;

    // Asegurar booleano (sin undefined)
    const hasEmptyOption = Array.isArray(q.options)
      ? q.options.some(o => !o || !o.text || !o.text.trim())
      : true;

    const badIndex = !Number.isInteger(idx) || idx < 0 || idx > 3;

    return hasEmptyStatement || wrongOptionsCount || hasEmptyOption || badIndex;
  });
}


  

  // ---- Modal actions ----
  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  
  async submit() {
    if (this.isInvalid() || this.submitting) return;

    const payload = {
      title: this.model.title.trim(),
      gradeLevel: this.model.gradeLevel,
      subject: this.model.subject,
      questions: this.model.questions.map(q => ({
        statement: q.statement.trim(),
        options: q.options.map(o => o.text.trim()), // <—
        correctIndex: q.correctIndex
      }))
    };

    this.submitting = true;

    try {
      // Llamada al backend
      const saved: StudentStatusTest = await firstValueFrom(
        this.testsService.createTest(payload)
      );

      // Toast de éxito (opcional)
      const ok = await this.toastCtrl.create({
        message: 'Prueba creada correctamente',
        duration: 2000,
        color: 'success'
      });
      ok.present();

      // Cierra devolviendo el objeto persistido
      this.modalCtrl.dismiss({ action: 'created', test: saved }, 'confirm');

    } catch (e: any) {
      const err = await this.toastCtrl.create({
        message: e?.message || 'No se pudo guardar la prueba.',
        duration: 3000,
        color: 'danger'
      });
      err.present();
    } finally {
      this.submitting = false;
    }
  }
}
