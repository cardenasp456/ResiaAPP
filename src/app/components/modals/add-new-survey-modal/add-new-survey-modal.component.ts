import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { ChatService } from '../../../services/chat/chat.service';

@Component({
  selector: 'app-add-new-survey-modal',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './add-new-survey-modal.component.html',
  styleUrl: './add-new-survey-modal.component.scss'
})
export class AddNewSurveyModalComponent {

  surveyData = {
    studentName: '',
    subject: '',
    answers: Array(10).fill(null) // Array para almacenar las respuestas de las 10 preguntas
  };

  subjects = ['Matemáticas', 'Español', 'Naturales', 'Sociales', 'Artes', 'Música', 'Geometría']; // Lista de materias

  questions = [
    'Entiendo los conceptos básicos de esta materia.',
    'Me siento cómodo resolviendo ejercicios o actividades.',
    'La forma en que me explican en clase me ayuda a aprender.',
    'Me gusta aprender sobre esta materia.',
    'Creo que esta materia es útil para mi vida cotidiana.',
    'Me gustaría recibir más apoyo o recursos para mejorar en esta materia.',
    'Me siento motivado cuando estudio o practico esta materia.',
    'Considero que el nivel de dificultad de esta materia es adecuado para mí.',
    'Me gustaría que las clases fueran más dinámicas o prácticas en esta materia.',
    'Siento que esta materia me ayudará en mi futuro académico o profesional.'
  ];

  options = [
    { label: '1 = Muy en desacuerdo', value: 1 },
    { label: '2 = En desacuerdo', value: 2 },
    { label: '3 = Neutral', value: 3 },
    { label: '4 = De acuerdo', value: 4 },
    { label: '5 = Muy de acuerdo', value: 5 }
  ];


  constructor(
    private modalController: ModalController,
    private chatService: ChatService 
  ) {}

  closeModal() {
    this.modalController.dismiss();
  }

  submitSurvey() {
    console.log('Encuesta enviada:', this.surveyData);
    this.chatService.createSurvey(this.surveyData).subscribe(response => {
      console.log('Survey created:', response);
    });
    this.modalController.dismiss(); // Envía los datos al cerrar el modal
  }

}
