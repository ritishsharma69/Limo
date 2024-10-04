import { Injectable } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private loader: HTMLIonLoadingElement | null = null; // Store the loader instance
  isLoading = false;

  constructor(
    public alertController: AlertController,
    public loadingController: LoadingController,
    public toastController: ToastController
  ) {}

  async showAlert(title: string, msg: string) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
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

  showMessage(msg: string) {
    this.toastController
      .create({
        message: msg,
        duration: 3000,
        position: 'bottom',
      })
      .then((toast) => toast.present());
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
