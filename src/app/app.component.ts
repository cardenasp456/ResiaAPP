import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
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
export class AppComponent  {
  title = 'resia_app';
  chatOpen: boolean = false;
  searchActiveInChild: boolean = false;
  selectedChatId:  number = 0;
  @Output() chatOpened = new EventEmitter<void>(); 
  @ViewChild(MenuComponent) menuComponent!: MenuComponent; 
  @ViewChild(ChatComponent) chatComponent!: ChatComponent; 

  constructor(
    //private modalService: ModalService
  ) {

  }

  onSearchActivated() {
    this.searchActiveInChild = true;
    console.log('Search activated in child component:', this.searchActiveInChild);
    // Notificar al componente hijo
    if (this.menuComponent) {
      this.menuComponent.onSearchActivated();
    }
  }

  onChatIdReceived(chatId: number) {
    this.chatOpen = false;
    console.log('Chat ID recibido en el padre:', chatId);
    this.selectedChatId = chatId; 
    this.chatOpen = true; 
    this.chatComponent.onChatOpened(); 
  }

  // Método para manejar el evento de apertura de un chat
  onChatOpened() {
    this.chatOpen = false;
    this.selectedChatId = 0;
    this.chatOpen = true;
    this.chatComponent.onChatOpened(); 
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
