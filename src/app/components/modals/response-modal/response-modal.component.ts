import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {  ModalController } from '@ionic/angular/standalone';
@Component({
  selector: 'app-response-modal',
  templateUrl: './response-modal.component.html',
  styleUrls: ['./response-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None
})
export class ResponseModalComponent {
 
  
  @Input() type!: string;
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() link!: string;
  @Input() lastMessage!: string;

  constructor(
    private customModal: ModalController,
    private router: Router
  ) {}

  ngOnInit() {}

  getIcon() {
    return `assets/icon/${this.type}`;
  }

  closeModal() {
    this.customModal.dismiss(true)
  }


}
