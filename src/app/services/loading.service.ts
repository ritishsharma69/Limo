import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loadingInstances: HTMLIonLoadingElement[] = [];
  private requestCount = 0;

  constructor(private loadingController: LoadingController) {}

  async presentLoading() {
    this.requestCount++;
    if (this.requestCount === 1) {
      const loading = await this.loadingController.create({
        spinner: 'bubbles',
        backdropDismiss: false,
      });
      this.loadingInstances.push(loading);
      await loading.present();
    }
  }

  async dismissLoading() {
    if (this.requestCount > 0) this.requestCount--;

    if (this.requestCount === 0 && this.loadingInstances.length > 0) {
      const loading = this.loadingInstances.pop();
      if (loading) {
        await loading.dismiss();
      }
    }
  }

  async forceDismissLoader(): Promise<void> {
    while (this.loadingInstances.length > 0) {
      const loading = this.loadingInstances.pop();
      if (loading) {
        await loading.dismiss();
      }
    }
    this.requestCount = 0; // Reset counter
  }
}
