import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonLabel, IonItem, IonCard, IonCardHeader, IonCardTitle } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { PickDropComponent } from "../reusable-components/pick-drop/pick-drop.component";
import { NavigateButtonComponent } from "../reusable-components/navigate-button/navigate-button.component";
import { HeadlineCompComponent } from "../reusable-components/headline-comp.component";

@Component({
  selector: 'app-single-trip-detail',
  templateUrl: './single-trip-detail.component.html',
  styleUrls: ['./single-trip-detail.component.scss'],
  standalone: true,
  imports: [IonCardTitle, IonCardHeader, IonCard, IonItem, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonLabel, CommonModule, FormsModule, PickDropComponent, NavigateButtonComponent, HeadlineCompComponent]
})
export class SingleTripDetailComponent implements OnInit {
  trip: any;
  selectedStatus: string = ''

  constructor() {
    const navigation = history.state;
    if (navigation && navigation.trip) {
      this.trip = navigation.trip;
      this.selectedStatus = navigation.trip.status;
      console.log(navigation);
    }
  }

  ngOnInit() {}
}
