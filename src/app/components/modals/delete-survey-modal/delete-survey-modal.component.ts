import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { ChatService } from '../../../services/chat/chat.service';

@Component({
  selector: 'app-delete-survey-modal',
  imports: [IonicModule, CommonModule],
  templateUrl: './delete-survey-modal.component.html',
  styleUrl: './delete-survey-modal.component.scss'
})
export class DeleteSurveyModalComponent implements OnInit {

  surveys = [
    {
      summary_id: 1, 
      student_name: 'Juan Pérez',
      subject: 'Matemáticas',
      answers: [5, 4, 3, 5, 4, 3, 5, 4, 3, 5]
    }
  ];

  constructor(
    private modalController: ModalController,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.getSurveys();
  }

  closeModal() {
    this.modalController.dismiss();
  }

  getSurveys() {
    this.chatService.getAllSurveys().subscribe(response => {
      console.log('Encuestas obtenidas:', response);
      this.surveys = response.map((survey: any) => ({
        summary_id: survey.summary_id,
        student_name: survey.student_name , 
        subject: survey.subject,
        answers: JSON.parse(survey.answers) 
      }));
    });
  }

  deleteSurveyById(summary_id: number, index: number, subject: string) {
    const data = {
      summary_id: summary_id,
      subject: subject
    };
    console.log('Datos para eliminar la encuesta:', data);
    this.chatService.deleteSurvey(data).subscribe(
      () => {
        console.log(`Encuesta con ID ${summary_id} eliminada.`);
        this.surveys.splice(index, 1); 
      },
      error => {
        console.error('Error al eliminar la encuesta:', error);
      }
    );
  }
}
