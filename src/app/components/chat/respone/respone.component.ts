import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  typingSpeed: number = 10; // Velocidad de escritura en milisegundos

  constructor() { }

  @Input() 
  set message(value: string) { // ✅ Ahora `message` es un setter
    if (value) {
      console.log('Nuevo mensaje recibido:', value);
      this.fullResponse = this.cleanWhitespace(value);
      this.response = ""; // Reiniciar la respuesta antes de empezar el efecto
      this.startTypingEffect();
    }
  }

  /** 🔹 Método para eliminar espacios en blanco innecesarios */
  private cleanWhitespace(text: string): string {
    return text.trimEnd(); // ❌ Elimina solo los espacios en blanco del final
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
