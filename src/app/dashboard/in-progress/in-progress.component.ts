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
  ],
})
export class InProgressComponent implements OnInit {
submit() {
throw new Error('Method not implemented.');
}
  private commonService = inject(CommonService);

  currentStatus: string = 'onTheWay';
  waitingTime: number = 0;
  waitingButtonLabel: string = 'START';
  waitingTimer: any;

  notes: string = '';
  additionalCosts: { name: string; amount: number }[] = [
    { name: '', amount: 0 },
  ];
  mileageIn: number = 0;
  mileageOut: number = 0;

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

  options: Option[] = [
    { value: 'onTheWay', label: 'On The Way' },
    { value: 'arrived', label: 'Arrived' },
    { value: 'noShow', label: 'No Show' },
    { value: 'passengerInCar', label: 'Passenger In Car' },
    { value: 'droppedPassenger', label: 'Dropped Passenger' },
  ];

  constructor() {}

  ngOnInit() {}

  changeStatus() {
    if (this.currentStatus) {
      this.commonService.showToast(
        `Status changed to ${this.currentStatus}`,
        'success'
      );
      console.log(`Status changed to: ${this.currentStatus}`);

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
      this.waitingTime = 0;
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

  addCost() {
    this.additionalCosts.push({ name: '', amount: 0 });
  }

  removeCost(index: number) {
    this.additionalCosts.splice(index, 1);
  }
}