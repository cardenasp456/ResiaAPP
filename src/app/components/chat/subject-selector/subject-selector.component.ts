import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-subject-selector',
  imports: [
    CommonModule,
  ],
  templateUrl: './subject-selector.component.html',
  styleUrl: './subject-selector.component.scss'
})
export class SubjectSelectorComponent {

  @Output() subjectSelected = new EventEmitter<any>();

  selectedSubject: string | null = null; 
  
  subjects = [
    { name: 'Español', icon: 'pi pi-book', color: '#ff5733', lightColor: '#ff8f70' },
    { name: 'Matemáticas', icon: 'pi pi-calculator', color: '#3498db', lightColor: '#85c1e9' },
    { name: 'Sociales', icon: 'pi pi-globe', color: '#f1c40f', lightColor: '#f7dc6f' },
    { name: 'Naturales', icon: 'pi pi-sun', color: '#2ecc71', lightColor: '#82e0aa' },  // 🌱
    { name: 'Artes', icon: 'pi pi-palette', color: '#9b59b6', lightColor: '#c39bd3' },
    { name: 'Música', icon: 'pi pi-volume-up', color: '#e74c3c', lightColor: '#f5b7b1' },   // 🔊
    { name: 'Geometría', icon: 'pi pi-circle', color: '#34495e', lightColor: '#7f8c8d' }   // ⚫
];

  selectSubject(subject: any) {
    this.selectedSubject = subject.name; // Guarda la materia seleccionada
    console.log('Materia seleccionada:', subject.name);
    this.subjectSelected.emit(subject);
  }
}
