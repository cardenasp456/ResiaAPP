import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { ChatService } from '../../../services/chat/chat.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-curriculum-modal',
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './edit-curriculum-modal.component.html',
  styleUrl: './edit-curriculum-modal.component.scss'
})
export class EditCurriculumModalComponent {

  @Input() curriculumData: any;

  constructor(
    private modalController: ModalController, 
    private chatService: ChatService
  ) {}

  closeModal() {
    this.modalController.dismiss();
  }


 
  // Método para manejar el evento input en objetivos
  onObjectiveInput(event: Event, unitIndex: number, objectiveIndex: number) {
    console.log('unitIndex:', unitIndex);
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.curriculumData.units[unitIndex].objectives[objectiveIndex] = inputElement.value;
    }
  }

  // Método para manejar el evento input en contenido
  onContentInput(event: Event, unitIndex: number, topicIndex: number, contentIndex: number) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.curriculumData.units[unitIndex].topics[topicIndex].content[contentIndex] = inputElement.value;
    }
  }

    // Método para actualizar un objetivo
    updateObjective(unitIndex: number, objectiveIndex: number, value: string) {
      this.curriculumData.units[unitIndex].objectives[objectiveIndex] = value;
    }
  
    // Método para actualizar el contenido de un tema
    updateContent(unitIndex: number, topicIndex: number, contentIndex: number, value: string) {
      this.curriculumData.units[unitIndex].topics[topicIndex].content[contentIndex] = value;
    }

  // Método para añadir una nueva unidad
  addUnit() {
    this.curriculumData.units.push({
      unit_name: '',
      objectives: [],
      topics: [],
      resources: []
    });
  }

  // Método para añadir un nuevo objetivo a una unidad
  addObjective(unitIndex: number) {
    this.curriculumData.units[unitIndex].objectives.push('');
  }

  // Método para añadir un nuevo tema a una unidad
  addTopic(unitIndex: number) {
    this.curriculumData.units[unitIndex].topics.push({
      topic_name: '',
      content: [],
      assessment_methods: []
    });
  }

  // Método para añadir contenido a un tema
  addContent(unitIndex: number, topicIndex: number) {
    this.curriculumData.units[unitIndex].topics[topicIndex].content.push('');
  }


  submitEdit() {
     // Ajustar el formato de curriculumData al formato requerido
     console.log('curriculumData:', this.curriculumData);

     const updated_data = {
       course_name: this.curriculumData.course_name,
       grade_level: this.curriculumData.grade_level,
       updated_data: {
         course_name: this.curriculumData.course_name,
         grade_level: this.curriculumData.grade_level,
         units: this.curriculumData.units.map((unit: any) => ({
           unit_name: unit.unit_name,
           objectives: unit.objectives,
           topics: unit.topics.map((topic: any) => ({
             topic_name: topic.topic_name,
             content: topic.content,
             assessment_methods: topic.assessment_methods
           })),
           resources: unit.resources
         }))
       }
     };
    
    this.chatService.editCurriculumh(updated_data).subscribe(
      response => {
        console.log('Plan de estudio actualizado:', response);
        this.modalController.dismiss(response); // Cierra el modal y envía los datos actualizados
      },
      error => {
        console.error('Error al actualizar el plan de estudio:', error);
      }
    );
  }

}
