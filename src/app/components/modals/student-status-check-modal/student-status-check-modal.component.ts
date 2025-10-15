import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ModalController, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonFooter, IonList, IonItem, IonLabel, IonInput,
  IonSelect, IonSelectOption, IonIcon
} from '@ionic/angular/standalone';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { StudentStatusTestService, SubmissionListItem } from '../../../services/studen-test/student-status-test.service';
import { RadarAnalyticsModalComponent } from '../radar-analytics-modal/radar-analytics-modal.component';

type FiltersForm = FormGroup<{
  studentId: FormControl<string>;
  gradeLevel: FormControl<string>;
  subject: FormControl<string>;
}>;

@Component({
  selector: 'app-student-status-check-modal',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonFooter, IonList, IonItem, IonLabel, IonInput,
    IonSelect, IonSelectOption, IonIcon
  ],
  templateUrl: './student-status-check-modal.component.html',
  styleUrls: ['./student-status-check-modal.component.scss']
})
export class StudentStatusCheckModalComponent implements OnInit, OnDestroy {
  grades = ['6', '7', '8', '9', '10', '11'];
  subjects = ['Español', 'Matemáticas', 'Sociales', 'Naturales', 'Artes', 'Música', 'Geometría'];

  form: FiltersForm;
  items: SubmissionListItem[] = [];
  loading = false;
  error?: string;
  page = 1; pageSize = 20; total = 0;

  private sub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private service: StudentStatusTestService
  ) {
    this.form = this.fb.nonNullable.group({
      studentId: this.fb.nonNullable.control(''),
      gradeLevel: this.fb.nonNullable.control(''),
      subject: this.fb.nonNullable.control(''),
    });
  }

  ngOnInit(): void {
    this.load();
    this.sub = this.form.valueChanges.pipe(debounceTime(250)).subscribe(() => {
      this.page = 1; this.load();
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  close() { this.modalCtrl.dismiss(null, 'cancel'); }

  load() {
    const f = this.form.getRawValue();
    this.loading = true; this.error = undefined;
    this.service.listSubmissions({
      studentId: f.studentId?.trim(),
      gradeLevel: f.gradeLevel || undefined,
      subject: f.subject || undefined,
      page: this.page, pageSize: this.pageSize
    }).subscribe({
      next: (res) => {
        this.items = res.items || [];
        this.total = res.total || 0;
        this.loading = false;
      },
      error: (e) => { this.error = e?.message || 'No se pudo cargar.'; this.items = []; this.loading = false; }
    });
  }

  async openItem(it: SubmissionListItem) {
    // pide el detalle para traer radar persistido
    const detail = await this.service.getSubmission(it.id).toPromise();
    const modal = await this.modalCtrl.create({
      component: RadarAnalyticsModalComponent,
      componentProps: { result: detail },
      cssClass: 'radar-modal'
    });
    await modal.present();
  }

  get totalPages(): number {
    const size = Math.max(1, this.pageSize || 1);
    return Math.max(1, Math.ceil((this.total || 0) / size));
  }

  nextPage() { if (this.page < this.totalPages) { this.page++; this.load(); } }
  prevPage() { if (this.page > 1) { this.page--; this.load(); } }
}
