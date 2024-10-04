import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loading: HTMLIonLoadingElement | null = null;
  private requestCount = 0;

  constructor(private loadingController: LoadingController, private http: HttpClient) {}

  async presentLoading() {
    if (this.requestCount === 0 && !this.loading) {
      this.loading = await this.loadingController.create({
        spinner: 'circles',
        cssClass: 'transparent-loader',
        backdropDismiss: false, 
      });
      await this.loading.present();
    }
    this.requestCount++;
  }

  async dismissLoading() {
    this.requestCount--;
    if (this.requestCount === 0 && this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}