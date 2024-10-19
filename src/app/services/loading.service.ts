import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loading: HTMLIonLoadingElement | null = null;
  private requestCount = 0;

  constructor(private loadingController: LoadingController) {}

  async presentLoading() {
    this.requestCount++;
    if (this.requestCount === 1) {
      // Only create and present the loader when the first request comes in
      try {
        this.loading = await this.loadingController.create({
          spinner: 'bubbles',
          cssClass: 'transparent-loader',
          backdropDismiss: false,
          message: 'Loading...',
        });
        await this.loading.present();
      } catch (error) {
        console.error('Error presenting loader:', error);
      }
    }
  }

  async dismissLoading() {
    if (this.requestCount > 0) this.requestCount--;

    if (this.requestCount === 0 && this.loading) {
      try {
        await this.loading.dismiss();
      } catch (error) {
        console.warn('Dismiss Loader Error:', error);
      } finally {
        this.loading = null; // Reset loader after dismiss
      }
    }
  }

  async forceDismissLoader(): Promise<void> {
    if (this.loading) {
      try {
        await this.loading.dismiss();
      } catch (error) {
        console.warn('Force Dismiss Error:', error);
      } finally {
        this.loading = null;
        this.requestCount = 0; // Reset counter
      }
    }
  }
}
