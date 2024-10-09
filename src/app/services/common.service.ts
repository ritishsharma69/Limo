import { Injectable } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private loader: HTMLIonLoadingElement | null = null;
  isLoading = false;

  constructor(
    public alertController: AlertController,
    public loadingController: LoadingController,
    public toastController: ToastController
  ) {}

  async showAlert(title: string, msg: string, buttons?: any[]) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: buttons || ['OK'],
    });
    await alert.present();
  }

  async showLoader() {
    // You might want to keep this if you have a specific use case for it
    const loader = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loader.present();
  }

  async hideLoader() {
    await this.loadingController.dismiss();
  }

  async showToast(msg: string, type: 'success' | 'error' | 'warning') {
    let color =
      type === 'success'
        ? 'success'
        : type === 'error'
        ? 'danger'
        : type === 'warning'
        ? 'warning'
        : 'primary';

    let toast = this.toastController.create({
      message: msg,
      color: color,
      duration: 3000,
      position: 'bottom',
      cssClass: 'custom-toast',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
        },
      ],
    });
    await (await toast).present();
  }

  async showSimpleLoader() {
    this.isLoading = true;

    // Create loader and store the instance
    this.loader = await this.loadingController.create({
      spinner: 'bubbles',
      cssClass: 'custom-loading',
      translucent: true,
    });

    await this.loader.present();

    // If loading is set to false, dismiss the loader
    this.loader.onDidDismiss().then(() => {
      this.isLoading = false;
      this.loader = null; // Reset the loader instance
    });
  }

  async hideSimpleLoader() {
    this.isLoading = false;

    // Ensure there's a loader to dismiss
    if (this.loader) {
      await this.loader.dismiss();
      this.loader = null; // Reset the loader instance
    }
  }
}
