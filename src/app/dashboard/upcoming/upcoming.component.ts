import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { PickDropComponent } from '../../reusable-components/pick-drop/pick-drop.component';
import { ExtraItemsComponent } from '../../reusable-components/extra-items/extra-items.component';
import { HeadlineCompComponent } from '../../reusable-components/headline-comp.component';
import { ApiService } from 'src/app/services/api.service';
import { CommonConfirmationModalComponent } from '../../reusable-components/common-confirmation-modal/common-confirmation-modal.component';
import { NavigateButtonComponent } from '../../reusable-components/navigate-button/navigate-button.component';
import { CommonService } from 'src/app/services/common.service';
import { addIcons } from 'ionicons';
import { chevronDownCircleOutline } from 'ionicons/icons';
import { ITripType } from 'src/app/model/interface';
import { AppService } from 'src/app/services/auth.service';
import { CustomDateTimePipe } from 'src/app/pipe/customDateTime.pipe';
import { TripCountService } from 'src/app/services/tripCount.service';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.scss'],
  standalone: true,
  imports: [
    IonRefresherContent,
    IonRefresher,
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
    CustomDateTimePipe,
  ],
})
export class UpcomingComponent {
  actionTitle = '';
  actionText = '';
  showConfirmationModal = false;

  showStatusChangeModal = false;
  selectedStatus: string = '';
  selectedReservationId: string = '';

  tripDetails: any;
  extraInfo: any;
  showDetails = false;

  private apiService = inject(ApiService);
  private commonService = inject(CommonService);
  private router = inject(Router);
  private appService = inject(AppService);
  private tripCountService = inject(TripCountService);

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
    this.apiService
      .fetchBookingDetails({
        fetchAddresses: true,
        passengers: true,
        fleet: true,
        currency: true,
        driver: true,
        bookingStatus:true,
        // driver_status_id: 2,
      })
      .subscribe({
        next: (response) => {
          if (!response || !response.data) {
            console.error('API response is empty or undefined.');
            return;
          }

          this.tripDetails = response.data || [];

          if (this.tripDetails.length > 0) {
            // this is soting code (acc.).
            this.tripDetails.sort((a: any, b: any) => {
              const aDateTime = new Date(`${a.pu_date}T${a.pu_time}`).getTime();
              const bDateTime = new Date(`${b.pu_date}T${b.pu_time}`).getTime();
              return aDateTime - bDateTime;
            });

            this.updateTripCounts();

            this.addExtraInfoToTrips(this.tripDetails);
            this.pickupAndDropoffAddresses(this.tripDetails);
            console.log(
              'Regular Bookings with Fleet Details:',
              this.tripDetails
            );
          }
        },
        error: (error) => {
          console.error('Error fetching trip details:', error);
        },
      });
  }

  private updateTripCounts() {
    const upcomingCount = this.tripDetails.length;
    console.log('Upcoming Count:', upcomingCount);
    this.tripCountService.updateUpcomingCount(upcomingCount);
  }  

  private addExtraInfoToTrips(trips: ITripType[]) {
    this.tripDetails = trips.map((trip: ITripType) => {
      const passengers = trip.passengers || [];

      return {
        ...trip,
        extraInfo: {
          miles: trip.distance,
          hours: trip.hours,
          no_of_passengers: passengers.length || 0,
          no_of_luggage: trip.no_of_luggage || 0,
          child_seat_count: trip.child_seat_count || 0,
        },
      };
    });
  }

  // Helper method to  pickup and dropoff addresses
  private pickupAndDropoffAddresses(trips: any[]) {
    trips.forEach((trip: any) => {
      const pickup = trip.addresses?.find(
        (addr: any) => addr.type === 'pickup'
      );
      const dropoff = trip.addresses?.find((addr: any) => addr.type === 'drop');

      trip.pickupAddress = pickup?.address ?? 'No Pickup Address';
      trip.dropoffAddress = dropoff?.address ?? 'No Dropoff Address';
    });
  }

  toggleDetails(index: number) {
    this.tripDetails.forEach((trip: { showDetails: boolean }, i: number) => {
      trip.showDetails = i === index ? !trip.showDetails : false;
    });
  }

  openStatusChangeModal(reservationId: string) {
    this.selectedReservationId = reservationId;
    this.showStatusChangeModal = true;
  }

  confirmStatusChange(status: string) {
    // this.apiService.upcomingStatusChange(status).subscribe({
    //   next: () => {
    //     this.showStatusChangeModal = false;
    //   },
    //   error: (error) => {
    //     console.error('Error changing status:', error);
    //     this.showStatusChangeModal = false;
    //   },
    // });
  }

  cancelStatusChange() {
    this.showStatusChangeModal = false;
  }

  startTrip(reservationId: string) {
    this.actionTitle = 'Confirm Start Trip';
    this.actionText = 'You are about to start the trip';
    this.selectedReservationId = reservationId;
    this.showConfirmationModal = true;
  }

  handleConfirmation(isConfirmed: boolean) {
    if (isConfirmed) {
      this.confirmTrip(this.selectedReservationId);
    } else {
      this.commonService.showToast('Action Canceled', 'warning');
    }
    this.showConfirmationModal = false;
    this.selectedReservationId = '';
  }

  confirmTrip(reservationId: string) {
    this.apiService.startBooking(reservationId, '5').subscribe({
        next: (response) => {
            console.log('Status changed successfully:', response);
            this.showStatusChangeModal = false;
            this.commonService.showToast('Trip is now In Progress', 'success');
            setTimeout(() => {
                this.router.navigate(['/dashboard/in-progress']);
            }, 300);
        },
        // error: (error) => {
        //     console.error('Error changing status:', error);
        //     this.showStatusChangeModal = false;
        // },
        error: (error) => {
          console.error('Error changing status:', error);
          this.showStatusChangeModal = false;
          if (
            error?.message === 'This Driver Already has a Booking in Progress'
          ) {
            alert('This Driver Already has a Booking in Progress');
          } else {
            this.commonService.showToast('Already have 1 booking in In-Progress', 'error');
          }
        },
    });
}


  onModalClose() {
    this.showConfirmationModal = false;
  }
}