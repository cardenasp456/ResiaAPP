import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CardModule } from 'primeng/card';
import { PrimeIcons } from 'primeng/api';

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


  constructor(private ngZone: NgZone) {}

  ngOnInit() {
  }

  items = [
    {
      label: 'Encuestas',
      icon: 'pi pi-file',
      items: [{ label: 'Nueva' }, { label: 'Modificar' }]
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

}
