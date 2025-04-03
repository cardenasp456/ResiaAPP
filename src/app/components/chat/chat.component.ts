import { Component, EventEmitter, Output } from '@angular/core';
import { SubjectSelectorComponent } from './subject-selector/subject-selector.component';
import { SearchComponent } from './search/search.component';
import { ResponeComponent } from './respone/respone.component';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ModalController } from '@ionic/angular';
import { ModalService } from '../../services/modal/modal.service';
import { ChatService } from '../../services/chat/chat.service';
import { emit } from 'process';

@Component({
  selector: 'app-chat',
  imports: [
    SubjectSelectorComponent,
    SearchComponent,
    ResponeComponent,
    CommonModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in-out', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class ChatComponent {

  searchActive: boolean = false;
  subjectSelected: any;
  responseMessage: string = " ";

  constructor(
    private modalController: ModalController,
    private modalService: ModalService,
    private chatService: ChatService
  ) { }

  handleSearch(searchQuery: any) {
    console.log('Search query received:', searchQuery);
    if(this.subjectSelected === undefined){
      this.modalService.openResponseModal('warning.png', 'Error de selección' , 'Debe seleccionar una materia para continuar. Por favor, seleccione una materia e inténtelo de nuevo.', '');
    }else {
      this.chatService.modificarPlan(this.subjectSelected.name, searchQuery).subscribe(response => {
         this.responseMessage = response.message.content;
         console.log(this.responseMessage);
         this.searchActive = true; // Oculta SubjectSelector y muestra ResponseComponent
      });
    }
  }

  onSubjectSelected(subject: any) {
    console.log('Subject received from child:', subject);
    this.subjectSelected = subject;
  }

}
