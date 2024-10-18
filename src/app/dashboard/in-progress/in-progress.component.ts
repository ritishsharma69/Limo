import { Component, inject, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonItem,
  IonNote,
  IonButton,
  IonButtons,
  IonToolbar,
  IonFooter,
  IonList,
  IonLabel,
  IonCardTitle,
  IonCardContent,
  IonContent,
  IonItemDivider,
  IonIcon,
  IonModal,
  IonTitle,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { PickDropComponent } from '../../reusable-components/pick-drop/pick-drop.component';
import { ExtraItemsComponent } from '../../reusable-components/extra-items/extra-items.component';
import { HeadlineCompComponent } from '../../reusable-components/headline-comp.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UpcomingComponent } from '../upcoming/upcoming.component';
import { CommonConfirmationModalComponent } from '../../reusable-components/common-confirmation-modal/common-confirmation-modal.component';
import { NavigateButtonComponent } from '../../reusable-components/navigate-button/navigate-button.component';
import { ActionConfirmationModalComponent } from '../../reusable-components/action-confirmation-modal/action-confirmation-modal.component';
import { CommonService } from 'src/app/services/common.service';
import { FormsModule } from '@angular/forms';
import { PaymentsTabComponent } from 'src/app/reusable-components/payments-tab/payments-tab.component';
import { ApiService } from 'src/app/services/api.service';
import { CustomDateTimePipe } from 'src/app/pipe/customDateTime.pipe';

interface Option {
  value: string;
  label: string;
}

@Component({
  selector: 'app-in-progress',
  templateUrl: './in-progress.component.html',
  styleUrls: ['./in-progress.component.scss'],
  standalone: true,
  imports: [
    IonTitle,
    IonModal,
    RouterLink,
    IonIcon,
    IonItemDivider,
    IonContent,
    IonCardContent,
    IonCardTitle,
    IonLabel,
    IonItem,
    IonCardHeader,
    IonCard,
    IonNote,
    IonButton,
    IonButtons,
    IonToolbar,
    IonFooter,
    IonList,
    CommonModule,
    PickDropComponent,
    ExtraItemsComponent,
    UpcomingComponent,
    HeadlineCompComponent,
    CommonConfirmationModalComponent,
    NavigateButtonComponent,
    ActionConfirmationModalComponent,
    PaymentsTabComponent,
    IonSelect,
    IonSelectOption,
    FormsModule,
    CustomDateTimePipe,
  ],
})
export class InProgressComponent implements OnInit {
  private commonService = inject(CommonService);
  private apiService = inject(ApiService);

  currentStatus: string = 'ontheway';
  waitingTime: number = 0;
  waitingButtonLabel: string = 'START';
  waitingTimer: any;

  notes: string = '';
  mileageIn: number | null = null;
  mileageOut: number | null = null;
  finalizeTabOpen: boolean = false;

  waitingTimeCost: number = 1;
  totalWaitingCost: number = 0;
  
  tripDetails: any;

  toggleFinalizeTab() {
    this.finalizeTabOpen = !this.finalizeTabOpen;
  }

  reservations = [
    {
      id: '123',
      date: '12 Oct, 6:30 PM',
      name: 'Passenger Name 1',
      reservationId: '#374836',
      tripDate: '2024-09-21',
      passengerName: 'John Doe',
      phone: '123456789',
      pickupAddress: '123 Main St, Shimla',
      dropoffAddress: '456 Elm St, Chandigarh',
      requirements: '1 suitcase per passenger, no food allowed.',
      extraInfo: {
        luggage: '1 suitcase per passenger',
        instructions: 'Arrive 15 minutes early',
        notes: 'No food allowed in the vehicle.',
        miles: '12',
        hours: '3',
      },
      showDetails: false,
    },
  ];

  selectedReservation = this.reservations[0];

  options: Option[] = [];

  constructor() {}

  ngOnInit() {
    this.fetchBooking();
    this.fetchDriverStatus();
  }

  fetchBooking() { 
    this.apiService.inProgress().subscribe({
      next: (response: any) => {
        if (!response || !response.data) {
          console.error('API response is empty or undefined.');
          return;
        } 
        
        if (response.data.length === 0) {
          console.error('Trip details are empty.');
          return;
        }
  
        this.tripDetails = response.data;
        this.pickupAndDropoffAddresses(this.tripDetails);
        console.log(this.tripDetails);
      },
      error: (error) => {
        console.error('Error fetching trip details:', error);
      },
    });
  }
  
  private pickupAndDropoffAddresses(trip: any) {
    if (trip && typeof trip === 'object' && Array.isArray(trip.addresses)) {
      const pickup = trip.addresses.find(
        (addr: any) => addr.type === 'pickup'
      );
      const dropoff = trip.addresses.find((addr: any) => addr.type === 'drop');
  
      trip.pickupAddress = pickup?.address ?? 'No Pickup Address';
      trip.dropoffAddress = dropoff?.address ?? 'No Dropoff Address';
    } else {
      console.log('Expected trip to be an object with addresses:', trip);
    }
  }
  

  fetchDriverStatus() {
    this.apiService.driverStatus().subscribe({
      next: (response) => {
        console.log(response);

        this.options = response.data.map((status: { name: string }) => ({
          value: status.name.toLowerCase().replace(/\s+/g, ''),
          label: status.name.replace(/([A-Z])/g, ' $1').trim(),
        }));
        console.log(this.options);
      },
      error: (err) => {
        console.error('Error fetching driver status:', err);
      },
    });
  }

  getCurrentStatusLabel(): string {
    const option = this.options.find((opt) => opt.value === this.currentStatus);
    return option ? option.label : '';
  }

  calculateWaitingCost(): number {
    return Math.floor(this.waitingTime / 60) * this.waitingTimeCost;
  }

  changeStatus() {
    if (this.currentStatus) {
      this.commonService.showToast(
        `Status changed to ${this.getCurrentStatusLabel()}`,
        'success'
      );
      console.log(`Status changed to: ${this.getCurrentStatusLabel()}`);

      if (this.waitingTimer) {
        clearInterval(this.waitingTimer);
        this.waitingTimer = null;
        this.waitingButtonLabel = 'START';
      }
    } else {
      alert('Please select a status first.');
    }
  }

  startWaitingTimer() {
    if (this.waitingTimer) {
      clearInterval(this.waitingTimer);
      this.waitingTimer = null;
      this.waitingButtonLabel = 'START';
      console.log(`Waiting time logged: ${this.waitingTime} seconds`);
    } else {
      this.waitingButtonLabel = 'STOP';
      this.waitingTimer = setInterval(() => {
        this.waitingTime += 1;
      }, 1000);
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds
    ).padStart(2, '0')}`;
  }
}
