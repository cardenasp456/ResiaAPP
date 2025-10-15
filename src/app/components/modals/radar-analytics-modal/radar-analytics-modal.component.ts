import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ChartData, ChartOptions } from 'chart.js';
import {
  ModalController, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonFooter, IonList, IonItem, IonLabel, IonIcon,
  IonAccordionGroup, IonAccordion, IonNote
} from '@ionic/angular/standalone';

interface RadarSkill {
  name: string;
  score: number;         // 0..100
  rationale?: string;
}

interface RadarPayload {
  id?: number;
  submissionId?: number;
  source?: string;
  method?: string;
  createdAt?: string;
  scale?: { min?: number; max?: number };
  overall?: { score?: number };
  skills: RadarSkill[];
}

interface SubmissionResult {
  id: number;
  studentId: string;
  testId: number;
  createdAt: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  analytics?: { radar?: RadarPayload };
}

@Component({
  selector: 'app-radar-analytics-modal',
  standalone: true,
  imports: [
    CommonModule, ChartModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonFooter, IonList, IonItem, IonLabel, IonIcon,
    IonAccordionGroup, IonAccordion, IonNote
  ],
  templateUrl: './radar-analytics-modal.component.html',
  styleUrls: ['./radar-analytics-modal.component.scss']
})
export class RadarAnalyticsModalComponent implements OnInit {
  @Input() result!: SubmissionResult;              // <- pásalo al abrir el modal
  @ViewChild('radarChart') radarChartRef: any;     // referencia a <p-chart>

  radar?: RadarPayload;
  chartData?: ChartData<'radar'>;
  chartOptions?: ChartOptions<'radar'>;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {
    const r = this.result?.analytics?.radar;
    if (!r || !r.skills?.length) return;

    const min = Number.isFinite(r.scale?.min as number) ? Number(r.scale!.min) : 0;
    const max = Number.isFinite(r.scale?.max as number) ? Number(r.scale!.max) : 100;

    // Etiquetas y valores
    const rawLabels = r.skills.map(s => s.name || '');
    const labels = rawLabels.map(lbl => this.wrapLabel(lbl, 18)); // ← multilínea
    const values = r.skills.map(s => this.clamp(Number(s.score), min, max));

    this.radar = r;

    this.chartData = {
      labels, // <- array de string[] (Chart.js admite arrays para multilínea)
      datasets: [
        {
          label: 'Desempeño',
          data: values,
          borderWidth: 2,
          borderColor: 'rgba(59,130,246,1)',      // azul accesible en dark
          backgroundColor: 'rgba(59,130,246,0.22)',
          pointBackgroundColor: 'rgba(59,130,246,1)',
          pointBorderColor: '#fff',
          pointHoverRadius: 5,
          pointRadius: 3,
          fill: true
        }
      ]
    };

    // Colores pensados para tema oscuro (ajusta si usas claro)
    const axisText = 'rgba(229,231,235,0.9)';  // gris claro
    const grid     = 'rgba(148,163,184,0.18)'; // gris tenue
    const angle    = 'rgba(148,163,184,0.25)';

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          min, max,
          grid: { color: grid },
          angleLines: { color: angle },
          ticks: {
            color: axisText,
            showLabelBackdrop: false,
            stepSize: Math.max(10, Math.round((max - min) / 5)),
          },
          pointLabels: {
            color: axisText,
            font: { size: 12, weight: 500 } // ← antes '500'
          }
        }
      },
      plugins: {
        legend: { labels: { color: axisText } },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.formattedValue} / ${max}`
          }
        }
      },
      animation: { duration: 250 }
    } as ChartOptions<'radar'>;
  }

// --- helpers ---
private wrapLabel(text: string, maxLineLen = 18): string[] {
  // Divide por palabras en líneas de longitud razonable
  const words = (text || '').split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxLineLen) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur = (cur ? cur + ' ' : '') + w;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [text];
}


  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  downloadPng() {
    // Intento genérico: obtener el <canvas> interno de PrimeNG
    const chartInst = this.radarChartRef?.chart;             // p-chart instancia
    const canvas: HTMLCanvasElement | undefined = chartInst?.canvas || chartInst?.chart?.canvas;
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    const name = `radar-submission-${this.radar?.submissionId || this.result?.id || 'export'}.png`;
    a.download = name;
    a.click();
  }

  private truncate(s: string, n: number): string {
    if (!s) return '';
    return s.length > n ? s.slice(0, n - 1) + '…' : s;
  }

  private clamp(x: number, min: number, max: number): number {
    if (!Number.isFinite(x)) return min;
    return Math.max(min, Math.min(max, Math.round(x)));
  }
}
