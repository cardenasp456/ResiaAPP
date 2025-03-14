import { Component } from '@angular/core';
import { SubjectSelectorComponent } from './subject-selector/subject-selector.component';
import { SearchComponent } from './search/search.component';
import { ResponeComponent } from './respone/respone.component';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

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

  handleSearch() {
    console.log('Búsqueda iniciada');
    this.searchActive = true; // Oculta SubjectSelector y muestra ResponseComponent
  }

}
