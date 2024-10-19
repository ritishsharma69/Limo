import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loading: HTMLIonLoadingElement | null = null;
  private requestCount = 0;
  private loaderTimeout: any;
  private debounceTimeout: any;

  constructor(private loadingController: LoadingController) {}

  // Debounced loader presentation to avoid spam requests showing multiple loaders
  async presentLoading() {
    this.requestCount++;
    
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout); // Clear any existing debounce timer
    }

    this.debounceTimeout = setTimeout(async () => {
      if (this.requestCount > 0 && !this.loading) {
        try {
          this.loading = await this.loadingController.create({
            spinner: 'bubbles',
            cssClass: 'transparent-loader',
            backdropDismiss: false,
            message: 'Loading...',
          });
          await this.loading.present();

          // Timeout to auto-dismiss loader if stuck
          this.loaderTimeout = setTimeout(() => this.forceDismissLoader(), 10000);
        } catch (error) {
          console.error('Error presenting loader:', error);
        }
      }
    }, 300); // Debounce time to prevent showing multiple loaders in rapid succession
  }

  async dismissLoading() {
    if (this.requestCount > 0) this.requestCount--;

    if (this.requestCount === 0 && this.loading) {
      try {
        clearTimeout(this.loaderTimeout); // Clear stuck timeout
        await this.loading.dismiss();
      } catch (error) {
        console.warn('Dismiss Loader Error:', error);
      } finally {
        this.loading = null;
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
        this.requestCount = 0; // Reset counter to avoid stuck loaders
      }
    }
  }

  // Optional: Reset the loader manually, e.g., after login or app re-initialization
  resetLoaderState(): void {
    clearTimeout(this.loaderTimeout);
    this.loading = null;
    this.requestCount = 0;
  }
}
