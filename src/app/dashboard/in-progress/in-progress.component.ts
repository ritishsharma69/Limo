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
import { PaymentsTabComponent } from 'src/app/reusable-components/payments-tab/payments-tab.component';

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
    PaymentsTabComponent
  ],
})
export class InProgressComponent implements OnInit {
  private commonService = inject(CommonService);

  startTrip: boolean = false;
  isModalOpen: boolean = false;
  showStatusChangeModal: boolean = false;
  showAdditionalOptions: boolean = false;

  showDropOffModal: boolean = false;
  showOtherStatusModal: boolean = false;

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

  constructor() {}

  ngOnInit() {
    // console.log('InProgressComponent initialized');
  }

  readyForTrip() {
    this.isModalOpen = true;
    console.log('Ready for trip clicked');
  }

  handleConfirmAction(isConfirmed: boolean) {
    if (isConfirmed) {
      this.startTrip = true;
      this.commonService.showToast('Trip Started', 'success');
      console.log('Trip Started!');
    } else {
      console.log('Trip Cancelled');
      this.commonService.showToast('Action Canceled', 'warning');
    }
  }

  onModalClose() {
    this.isModalOpen = false;
    console.log('Confirmation modal closed');
  }

  openStatusChangeModal(reservationId: string) {
    this.showStatusChangeModal = true;
    console.log(
      `Open status change modal for reservation ID: ${reservationId}`
    );
  }

  // confirmStatusChange(status: string) {
  //   console.log(`Status changed to: ${status}`);
  //   this.showStatusChangeModal = false;
  // }

  // cancelStatusChange() {
  //   this.showStatusChangeModal = false;
  //   console.log('Status change cancelled');
  // }

  confirmStatusChange(status: string) {
    if (status === 'dropoff') {
      this.showStatusChangeModal = false;
      this.showDropOffModal = true;
    } else if (status === 'other') {
      this.showStatusChangeModal = false;
      this.showOtherStatusModal = true;
    }
    console.log(`Status selected: ${status}`);
  }

  cancelStatusChange() {
    this.showStatusChangeModal = false;
    console.log('Status change cancelled');
  }

  finalizeAction(action: string) {
    if (action === 'done' || action === 'review') {
      console.log(`Trip finalized with action: ${action}`);
      this.showDropOffModal = false;
    } else if (action === 'canceled' || action === 'rescheduled') {
      console.log(`Trip finalized with action: ${action}`);
      this.showOtherStatusModal = false;
    }
  }

  closeDropOffModal() {
    this.showDropOffModal = false;
    console.log('Drop off modal closed');
  }

  closeOtherStatusModal() {
    this.showOtherStatusModal = false;
    console.log('Other status modal closed');
  }
}
