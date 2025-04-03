import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuComponent } from './components/menu/menu.component';
import { ChatComponent } from './components/chat/chat.component';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet, 
    ButtonModule,
    MenuComponent,
    ChatComponent,
    HomeComponent

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'resia_app';
  chatOpen = false; 

  constructor(
    //private modalService: ModalService
  ) {

  }

  // Método para manejar el evento de apertura de un chat
  onChatOpened() {
    this.chatOpen = true;
    console.log('Chat abierto, chatOpen:', this.chatOpen);
  }

  // Método para abrir un chat
  openChat() {
    this.chatOpen = true;
  }

  // Método para cerrar un chat
  closeChat() {
    this.chatOpen = false;
  }
  
}
