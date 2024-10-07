import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  async presentToast(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'success'
  ) {
    const color =
      type === 'success'
        ? 'success'
        : type === 'error'
        ? 'danger'
        : type === 'warning'
        ? 'warning'
        : 'primary';

    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: 3000,
      position: 'bottom',
      swipeGesture: 'vertical',
    });
    await toast.present();
  }
}
