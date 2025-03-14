import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-respone',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './respone.component.html',
  styleUrl: './respone.component.scss'
})
export class ResponeComponent {

  fullResponse: string = "Aquí tienes una respuesta generada con datos dummy. Puedes modificar esto con datos reales más adelante.";
  response: string = "";
  typingSpeed: number = 50; // Velocidad de escritura en milisegundos

  constructor() {
    this.startTypingEffect();
  }

  startTypingEffect() {
    let index = 0;
    this.response = "";

    const interval = setInterval(() => {
      if (index < this.fullResponse.length) {
        this.response += this.fullResponse[index];
        index++;
      } else {
        clearInterval(interval);
      }
    }, this.typingSpeed);
  }

}
