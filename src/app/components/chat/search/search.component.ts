import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalService } from '../../../services/modal/modal.service';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-search',
  imports: [
    FormsModule,
    IonicModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  
  @Output() searchEvent = new EventEmitter<void>(); // Emite un evento al padre
  query: string = '';

  constructor(
     private modalController: ModalController,
      private modalService: ModalService,
  ) {}

  performSearch() {
    console.log('Búsqueda iniciada:', this.query);
    if (this.query.trim()) {
      this.searchEvent.emit(); // Notifica al padre que la búsqueda ha comenzado
      this.query = ''; // Limpia el input después de buscar
    }else{
      console.log('Error de inicio de sesión');
      this.modalService.openResponseModal('warning.png', 'Error de búsqueda' , 'Debe llenar el cuadro de texto antes de hacer una pregunta. Por favor, ingrese su consulta e inténtelo de nuevo.', '');
    }
  }

  limitText() {
    const textarea = document.querySelector('.search-input') as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = '40px'; // Reiniciar el tamaño mínimo
      textarea.style.height = `${textarea.scrollHeight}px`; // Ajustar al contenido
    }
  }
}
