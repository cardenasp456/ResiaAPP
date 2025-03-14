import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../services/modal/modal.service';
import { IonicModule, ModalController } from '@ionic/angular';

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
    //private modalService: ModalService
  ) {}

  performSearch() {
    console.log('Búsqueda iniciada:', this.query);
    if (this.query.trim()) {
      this.searchEvent.emit(); // Notifica al padre que la búsqueda ha comenzado
      this.query = ''; // Limpia el input después de buscar
    }else{
      console.log('Error de inicio de sesión');
      //this.modalService.openResponseModal('warning.png', 'Error de inicio de sesión' , 'Correo electrónico o contraseña incorrectos. Por favor, verifica las credenciales e inténtalo de nuevo.', '');
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
