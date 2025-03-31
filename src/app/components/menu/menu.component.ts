import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CardModule } from 'primeng/card';
import { PrimeIcons } from 'primeng/api';
import { ModalController } from '@ionic/angular/standalone';
import { AddNewSurveyModalComponent } from '../modals/add-new-survey-modal/add-new-survey-modal.component';

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
    private modalController: ModalController
  ) {}

  ngOnInit() {
  }

  items = [
    {
      label: 'Encuestas',
      icon: 'pi pi-file',
      items: [{ label: 'Nueva', command: () => this.openNewSurveyModal() }, { label: 'Modificar' }]
    },
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      items: [{ label: 'Undo' }, { label: 'Redo' }]
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

}
