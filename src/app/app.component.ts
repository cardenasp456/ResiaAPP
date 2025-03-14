import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuComponent } from './components/menu/menu.component';
import { ChatComponent } from './components/chat/chat.component';
import { SubjectSelectorComponent } from './components/chat/subject-selector/subject-selector.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    ButtonModule,
    MenuComponent,
    ChatComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'resia_app';
}
