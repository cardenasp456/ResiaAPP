import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CardModule } from 'primeng/card';
import { PrimeIcons } from 'primeng/api';
import { ModalController } from '@ionic/angular/standalone';
import { AddNewSurveyModalComponent } from '../modals/add-new-survey-modal/add-new-survey-modal.component';
import { DeleteSurveyModalComponent } from '../modals/delete-survey-modal/delete-survey-modal.component';
import { ChatService } from '../../services/chat/chat.service';
import { EditCurriculumModalComponent } from '../modals/edit-curriculum-modal/edit-curriculum-modal.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    PanelMenuModule,
    ButtonModule,
    CardModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {


  constructor(
    private ngZone: NgZone,
    private modalController: ModalController,
    private chatService: ChatService,
  ) {}

  ngOnInit() {
  }

  items = [
    {
      label: 'Encuestas',
      icon: 'pi pi-file',
      items: [
        { label: 'Nueva', command: () => this.openNewSurveyModal() }, 
        { label: 'Eliminar', command: () => this.openDeleteSurveyModal() },
      ]
    },
    {
      label: 'Modificar planes de estudio',
      icon: 'pi pi-pencil',
      items: [
        { label: 'Español', command: () => this.openEditCurriculumModal23('Español', '7')  }, 
        { label: 'Matemáticas', command: () => this.openEditCurriculumModal23('Matemáticas', '7')}, 
        { label: 'Sociales', command: () => this.openEditCurriculumModal23('Sociales', '7') }, 
        { label: 'Naturales', command: () => this.openEditCurriculumModal23('Naturales', '7') }, 
        { label: 'Artes', command: () => this.openEditCurriculumModal23('Artes', '7') }, 
        { label: 'Música', command: () => this.openEditCurriculumModal23('Música', '7') }, 
        { label: 'Geometría', command: () => this.openEditCurriculumModal23('Geometría', '7') }
      ]
    }
  ];

  chats = [
    { id: 1, label: 'Hcp DataReader Issue' },
    { id: 2, label: 'Simulacro caída SaaS CRM' },
    { id: 3, label: 'Error Gradle Android Studio' },
    { id: 4, label: 'Pruebas Safari en Windows' },
    { id: 5, label: 'Script para crear tabla' }
  ];

  newChat() {
    console.log('Nuevo chat creado');
    this.chats.push({ id: this.chats.length + 1, label: 'Nuevo chat' });
  }

  openChat(chatId: number) {
    console.log('Abriendo chat con ID:', chatId);
    // Aquí puedes agregar la lógica para abrir un chat específico
  }

  async openNewSurveyModal() {
    const modal = await this.modalController.create({
      component: AddNewSurveyModalComponent
    });
  
    await modal.present();
  }

  async openDeleteSurveyModal() {
    const modal = await this.modalController.create({
      component: DeleteSurveyModalComponent
    });
  
    await modal.present();
  }

  openEditCurriculumModal(course_name: string, grade_level: string) {
    this.chatService.getCurriculum({ course_name, grade_level }).subscribe(
      (response) => {
        console.log('Curriculum data:', response);
        // Aquí puedes manejar la respuesta del curriculum
      }
    );
  }

  async openEditCurriculumModalh(curriculumData: any) {
    const modal = await this.modalController.create({
      component: EditCurriculumModalComponent,
      componentProps: { curriculumData: curriculumData }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      console.log('Plan de estudio actualizado:', data);
    }
  }

  async openEditCurriculumModal23(course_name: string, grade_level: string) {
    this.chatService.getCurriculum({ course_name, grade_level }).subscribe(
      (response) => { 
        console.log('Curriculum data:', response);
        this.openEditCurriculumModalh(response);
      }
    );
  }

}
