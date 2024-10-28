import { Component, inject } from '@angular/core';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
  IonChip,
  IonButton,
  IonIcon,
  IonModal,
  IonTitle,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { PickDropComponent } from 'src/app/reusable-components/pick-drop/pick-drop.component';
import { ExtraItemsComponent } from 'src/app/reusable-components/extra-items/extra-items.component';
import { HeadlineCompComponent } from '../../reusable-components/headline-comp.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CommonConfirmationModalComponent } from '../../reusable-components/common-confirmation-modal/common-confirmation-modal.component';
import { CommonModule } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';
import { addIcons } from 'ionicons';
import { chevronDownCircleOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import { ITripType } from 'src/app/model/interface';
import { CustomDateTimePipe } from 'src/app/pipe/customDateTime.pipe';
import { TripCountService } from 'src/app/services/tripCount.service';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.scss'],
  standalone: true,
  imports: [
    IonRefresherContent,
    IonRefresher,
    IonTitle,
    IonModal,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonCardSubtitle,
    IonItem,
    IonLabel,
    IonInput,
    IonText,
    IonChip,
    IonButton,
    IonIcon,
    PickDropComponent,
    ExtraItemsComponent,
    HeadlineCompComponent,
    CommonConfirmationModalComponent,
    CommonModule,
    RouterLink,
    CustomDateTimePipe,
  ],
})
export class PendingComponent {
  private router = inject(Router);
  private apiService = inject(ApiService);
  private commonService = inject(CommonService);
  private route = inject(ActivatedRoute);
  private tripCountService = inject(TripCountService);

  tripDetails: any;
  extraInfo: any;
  showDetails = false;

  showConfirmationModal: boolean = false;
  actionTitle = '';
  actionText = '';
  currentAction: 'accept' | 'reject' = 'accept';

  selectedBookingId: string = '';

  constructor() {}

  ngOnInit() {
    this.fetchBooking();

    this.route.queryParams.subscribe((params) => {
      const contentId = params['contentId'];
      if (contentId) {
        this.focusTripById(contentId);
      }
    });

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
      .fetchBookingDetails({ fetchAddresses: true, passengers: true })
      .subscribe({
        next: (response) => {
          if (!response) {
            console.error('API response is empty or undefined.');
            return;
          }

          this.tripDetails = response.data || [];
          this.tripDetails.sort((a: any, b: any) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA;
          });

          this.updateTripCounts();

          if (this.tripDetails.length > 0) {
            this.addExtraInfoToTrips(this.tripDetails);
            this.pickupAndDropoffAddresses(this.tripDetails);
            console.log('Regular Bookings:', this.tripDetails);
          } else {
            console.error('Trip details are empty.');
          }
        },
        error: (error) => {
          console.error('Error occurred while fetching the bookings:', error);
        },
      });
  }

  private updateTripCounts() {
    const pendingCount = this.tripDetails.length;
    console.log('Pending Count:', pendingCount);
    this.tripCountService.updatePendingCount(pendingCount);
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

  // Method to focus on a trip by contentId
  focusTripById(contentId: string) {
    const tripIndex = this.tripDetails.findIndex(
      (trip: any) => trip.id === contentId
    );

    if (tripIndex !== -1) {
      this.toggleDetails(tripIndex); // Open the trip details

      const element = document.getElementById(`trip-${contentId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        element.focus();
      }
    } else {
      console.warn(`No trip found with ContentId: ${contentId}`);
    }
  }

  onAccept(bookingId: string): void {
    this.selectedBookingId = bookingId;
    this.actionTitle = 'Confirm Acceptance';
    this.actionText = 'Accepting the trip';
    this.currentAction = 'accept';
    this.showConfirmationModal = true;
    console.log('Modal opened:', this.showConfirmationModal);
  }

  onReject(bookingId: string): void {
    this.selectedBookingId = bookingId;
    this.actionTitle = 'Confirm Rejection';
    this.actionText = 'Rejecting the trip';
    this.currentAction = 'reject';
    this.showConfirmationModal = true;
    console.log('Modal opened:', this.showConfirmationModal);
  }

  async handleConfirmation(isConfirmed: boolean) {
    if (isConfirmed) {
      this.showConfirmationModal = false;
      if (this.currentAction == 'accept') {
        this.commonService.showToast('Trip Accepted', 'success');
        setTimeout(() => {
          this.router.navigate(['/dashboard/upcoming']);
        }, 300);
        //   this.apiService.acceptRequest().subscribe({
        //     next: () => {
        //       console.log('clicked accept');
        //     },
        //     error: (error) => {
        //       console.error('Error occurred:', error);
        //     },
        //   });
      } else if (this.currentAction == 'reject') {
        this.commonService.showToast('Trip Rejected', 'error');
        //   this.apiService.rejectRequest().subscribe({
        //     next: () => {
        //       this.router.navigate(['/dashboard']);
        //       console.log('clicked reject');
        //     },
        //     error: (error) => {
        //       console.error('Error occurred while rejecting the request:', error);
        //     },
        //   });
      }
    } else {
      console.log('Action canceled.');
      this.commonService.showToast('Action Canceled', 'warning');
    }
    this.showConfirmationModal = false;
  }
}
