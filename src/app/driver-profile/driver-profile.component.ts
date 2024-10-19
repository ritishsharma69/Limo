import { Component, inject, OnInit } from '@angular/core';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonButton,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonLabel,
  IonItem,
  IonInput,
  IonGrid,
  IonCol,
  IonRow,
  IonMenuButton,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ApiService } from '../services/api.service';
import { HeadlineCompComponent } from '../reusable-components/headline-comp.component';
import { addIcons } from 'ionicons';
import { chevronDownCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-driver-profile',
  templateUrl: './driver-profile.component.html',
  styleUrls: ['./driver-profile.component.scss'],
  standalone: true,
  imports: [
    IonRefresherContent,
    IonRefresher,
    IonRow,
    IonCol,
    IonGrid,
    IonInput,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonContent,
    IonTitle,
    IonBackButton,
    IonButtons,
    IonButton,
    IonToolbar,
    IonHeader,
    IonModal,
    CommonModule,
    RouterLink,
    HeadlineCompComponent,
    IonMenuButton,
  ],
})
export class DriverProfileComponent implements OnInit {
  private apiService = inject(ApiService);
  private commonService = inject(CommonService);

  driverProfile: any;

  constructor() {}

  ngOnInit() {
    this.fetchBooking();
    this.registerIcons();
  }

  private registerIcons(): void {
    addIcons({
      'chevron-down-circle-outline': chevronDownCircleOutline,
    });
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.fetchBooking();
      event.target.complete();
    }, 1000);
  }

  fetchBooking() {
    this.commonService.showSimpleLoader();

    this.apiService
      .fetchBookingDetails({
        driver: true,
      })
      .subscribe({
        next: (response) => {
          this.commonService.hideSimpleLoader();

          console.log('API Response:', response);

          if (!response || !response.data || response.data.length === 0) {
            console.error(
              'API response is empty, undefined, or missing driver object.'
            );
            return;
          }

          const firstBooking = response.data[0];
          if (firstBooking && firstBooking.driver) {
            this.driverProfile = firstBooking.driver;
            console.log(this.driverProfile);
          } else {
            console.error(
              'Driver object is missing in the first booking record.'
            );
          }
        },
        error: (error) => {
          console.error('Error occurred while fetching the bookings:', error);
          this.commonService.hideSimpleLoader();
        },
      });
  }
}
