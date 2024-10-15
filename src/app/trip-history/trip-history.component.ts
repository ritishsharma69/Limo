import { Component, inject, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCard,
  IonItem,
  IonLabel,
  IonRadioGroup,
  IonRadio,
  IonMenuButton,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-history',
  templateUrl: './trip-history.component.html',
  styleUrls: ['./trip-history.component.scss'],
  standalone: true,
  imports: [
    IonRadio,
    IonRadioGroup,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonItem,
    IonLabel,
    CommonModule,
    IonMenuButton,
  ],
})
export class TripHistoryComponent implements OnInit {
  selectedStatus: string = 'Completed';
  router = inject(Router);

  completedTrips = [
    {
      name: 'John Doe',
      status: 'Completed',
      date: '2023-09-20',
      image: '../../assets/imgs/passenger-profile.jpg',
      details: {
        pickUp: '123 Main St',
        dropOff: '456 Elm St',
        driver: 'Driver A',
        vehicle: 'Toyota Camry, ABC-1234',
        duration: '25 minutes',
        totalFare: '$15.00',
        paymentMethod: 'Credit Card',
        rating: '4.2',
      },
      payment: {
        paymentType: 'Credit Card', // Added paymentType
        total: '$15.00',
        amountPaid: '$15.00',
        remainingBalance: '$0.00',
      },
    },
    {
      name: 'Alice Brown',
      status: 'Completed',
      date: '2023-09-21',
      image: '../../assets/imgs/passenger-profile.jpg',
      details: {
        pickUp: '789 Pine St',
        dropOff: '101 Maple St',
        driver: 'Driver B',
        vehicle: 'Honda Accord, XYZ-5678',
        duration: '30 minutes',
        totalFare: '$20.00',
        paymentMethod: 'Debit Card',
        rating: '4.5',
      },
      payment: {
        paymentType: 'Debit Card', // Added paymentType
        total: '$20.00',
        amountPaid: '$20.00',
        remainingBalance: '$0.00',
      },
    },
  ];

  rejectedTrips = [
    {
      name: 'Jane Smith',
      status: 'Rejected',
      date: '2023-09-22',
      image: '../../assets/imgs/passenger-profile.jpg',
      details: {
        pickUp: '456 Oak St',
        dropOff: '789 Cedar St',
        driver: 'Driver C',
        vehicle: 'Ford Focus, LMN-1357',
        duration: '15 minutes',
        totalFare: '$10.00',
        paymentMethod: 'Cash',
        rating: '3.5',
      },
      payment: {
        paymentType: 'Cash', // Added paymentType
        total: '$10.00',
        amountPaid: '$0.00',
        remainingBalance: '$10.00',
      },
    },
    {
      name: 'Mark White',
      status: 'Rejected',
      date: '2023-09-23',
      image: '../../assets/imgs/passenger-profile.jpg',
      details: {
        pickUp: '321 Birch St',
        dropOff: '654 Spruce St',
        driver: 'Driver D',
        vehicle: 'Chevrolet Malibu, OPQ-2468',
        duration: '20 minutes',
        totalFare: '$12.00',
        paymentMethod: 'Credit Card',
        rating: '4.0',
      },
      payment: {
        paymentType: 'Credit Card', 
        total: '$12.00',
        amountPaid: '$0.00',
        remainingBalance: '$12.00',
      },
    },
  ];

  constructor() {}

  ngOnInit() {}

  onStatusChange(event: any) {
    this.selectedStatus = event.detail.value;
  }

  viewTripDetails(trip: any) {
    this.router.navigate(['/trip-detail'], { state: { trip } });
  }
}
