import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loading: HTMLIonLoadingElement | null = null;
  private requestCount = 0;

  constructor(private loadingController: LoadingController) {}

  async presentLoading(timeout: number = 10000) {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.loading = await this.loadingController.create({
        spinner: 'circles',
        cssClass: 'transparent-loader',
        backdropDismiss: false,
      });
      await this.loading.present();
      setTimeout(() => {
        if (this.loading) {
          this.dismissLoading();
        }
      }, timeout);
    }
  }
  

  async dismissLoading() {
    if (this.requestCount > 0) {
      this.requestCount--;
    }
    
    if (this.requestCount === 0 && this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}
