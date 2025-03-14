import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ResponseModalComponent } from '../../components/modals/response-modal/response-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(
    private router: Router,
    private modalCtrl: ModalController, // Asegurar que es ModalController
  ) {}

  async openResponseModal(type: any, title: any, subtitle: any, link: any, lastMessage?: any) {
    const modal = await this.modalCtrl.create({
      component: ResponseModalComponent,
      cssClass: "modal-response",
      componentProps: { type, title, subtitle, link, lastMessage }
    });

    modal.onDidDismiss().then(() => {
      if (link) {
        this.router.navigate([link]);
      }
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    return data;
  }
}