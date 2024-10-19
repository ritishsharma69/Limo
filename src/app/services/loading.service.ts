import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loading: HTMLIonLoadingElement | null = null;
  private requestCount = 0;

  constructor(private loadingController: LoadingController) {}

  async presentLoading(timeout: number = 10000): Promise<void> {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.loading = await this.loadingController.create({
        spinner: 'bubbles',
        cssClass: 'transparent-loader',
        backdropDismiss: false,
        message: 'Loading...',
      });
 
      await this.loading.present();
 
      setTimeout(() => {
        this.forceDismissLoader();
      }, timeout);
    }
  }
 
  async dismissLoading(): Promise<void> {
    if (this.requestCount > 0) {
      this.requestCount--;
    }
 
    if (this.requestCount === 0 && this.loading) {
      try {
        await this.loading.dismiss();
        this.loading = null; 
      } catch (error) {
        console.warn('Dismiss Loader Error:', error);
      }
    }
  }
 
  private async forceDismissLoader() {
    if (this.loading) {
      try {
        await this.loading.dismiss();
      } catch (error) {
        console.warn('Force Dismiss Error:', error);
      } finally {
        this.loading = null;
        this.requestCount = 0;
      }
    }
  }
}