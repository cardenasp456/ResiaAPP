import { ChangeDetectorRef, Component, EventEmitter, NgZone, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CardModule } from 'primeng/card';
import { ModalController } from '@ionic/angular/standalone';
import { AddNewSurveyModalComponent } from '../modals/add-new-survey-modal/add-new-survey-modal.component';
import { DeleteSurveyModalComponent } from '../modals/delete-survey-modal/delete-survey-modal.component';
import { ChatService } from '../../services/chat/chat.service';
import { EditCurriculumModalComponent } from '../modals/edit-curriculum-modal/edit-curriculum-modal.component';
import { StudentStatusTestModalComponent } from '../modals/student-status-test-modal/student-status-test-modal.component';
import { CreateStudentTestModalComponent } from '../modals/create-student-test-modal/create-student-test-modal.component';
import { StudentStatusCheckModalComponent } from '../modals/student-status-check-modal/student-status-check-modal.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [PanelMenuModule, ButtonModule, CardModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  @Output() chatOpened = new EventEmitter<void>(); 
  @Output() chatId = new EventEmitter<number>(); 
  @Output() exitChat = new EventEmitter<number>(); 
  chatOpen = false; 

  constructor(
    private ngZone: NgZone,
    private modalController: ModalController,
    private chatService: ChatService,
  ) {}

  ngOnInit() {
    this.getChats();
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
    },
    {
      label: 'Prueba de estado de estudiante',
      icon: 'pi pi-user-check',
      items: [
        { label: 'Iniciar prueba', icon: 'pi pi-play', command: () => this.openStudentStatusTestModal() },
        { label: 'Consultar estado', icon: 'pi pi-search', command: () => this.openStudentStatusCheckModal() },
        { label: 'Crear nueva prueba', icon: 'pi pi-plus', command: () => this.openCreateStudentTestModal() }
   
      ]
    }
  ];

  chats: { chat_id: number; title: string; history_id?: number; saved_at?: string }[] = [
    { chat_id: 1, title: 'Hcp DataReader Issue' },
  ];

  getChats() {
    this.chatService.getChatHistory().subscribe(
      (response: any) => {
        console.log('Historial de chats:', response);
        if (Array.isArray(response)) {
          this.chats = response.reverse();
        } else {
          console.error('La respuesta no es un array:', response);
        }
      },
      (error) => {
        console.error('Error al obtener el historial de chats:', error);
      }
    );
  }

  newChat() {
    console.log('Nuevo chat creado');
    const newChatId = this.chats.length > 0 ? Math.max(...this.chats.map(chat => chat.chat_id)) + 1 : 1;
    const newHistoryId = this.chats.length > 0 ? Math.max(...this.chats.map(chat => chat.history_id || 0)) + 1 : 1;

    this.chats.unshift({
      chat_id: newChatId,
      history_id: newHistoryId,
      saved_at: new Date().toISOString(),
      title: 'Nuevo chat'
    });

    console.log('Lista de chats actualizada:', this.chats);
    this.chatOpen = true; 
    this.chatOpened.emit(); 
  }

  onSearchActivated() {
    this.getChats();
    this.chatOpen = false;
  }

  openChat(chatId: number) {
    this.exitChat.emit(chatId); 
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

  // =========================================================
  // NUEVOS MÉTODOS: Prueba de estado de estudiante
  // =========================================================

  async openStudentStatusTestModal() {
    const modal = await this.modalController.create({
      component: StudentStatusTestModalComponent,
      componentProps: { mode: 'start' } // modo iniciar prueba
    });
    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role !== 'cancel' && data?.action === 'start') {
      console.log('Prueba iniciada con:', data.payload);
      // TODO: Integrar a tu backend/servicio:
      // this.chatService.startStudentStatusTest(data.payload).subscribe(...)
    }
  }

  async openStudentStatusCheckModal() {
  const modal = await this.modalController.create({
    component: StudentStatusCheckModalComponent,
    cssClass: 'state-test-modal'
  });
  await modal.present();
}

  async openCreateStudentTestModal() {
  const modal = await this.modalController.create({
    component: CreateStudentTestModalComponent
  });
  await modal.present();

  const { data, role } = await modal.onDidDismiss();
  if (role !== 'cancel' && data?.action === 'create') {
    console.log('Nueva prueba creada:', data.payload);
    // TODO: persistir en backend
    // this.chatService.createStudentTest(data.payload).subscribe(...)
  }
}
}
