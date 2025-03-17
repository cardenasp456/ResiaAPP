import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import { ResponseModalComponent } from '../../components/modals/response-modal/response-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    private router: Router,
    private customModal: ModalController,
  ) { }

  async openResponseModal(type: any, title: any, subtitle: any, link: any, lastMessage?: any) {
    const respondeModal = await this.customModal.create({
      component: ResponseModalComponent,
      cssClass:"modal-response",
      componentProps: {
        type,
        title,
        subtitle,
        link,
        lastMessage
      }
    });

    respondeModal.onDidDismiss().then(() => {
      if (link) {
        this.router.navigate([link]);
      }
    });

    respondeModal.present();
    const {data} = await respondeModal.onDidDismiss() 
    return data
  }
}
