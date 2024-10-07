import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  IonCard,
  IonButton,
  IonIcon,
  IonModal,
  IonTitle,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-extra-items',
  templateUrl: './extra-items.component.html',
  styleUrls: ['./extra-items.component.scss'],
  standalone: true,
  imports: [IonTitle, IonModal, IonCard, IonButton, IonIcon, CommonModule],
})
export class ExtraItemsComponent {
  @Input() showButton: boolean = true;
  @Input() extraInfo: {
    luggage_type: any;
    occasion_type: any;
    greeting_sign: any;
    greeting_sign_text: any;
    notes_to_driver: any;
    child_seat: any;
    luggage?: string;
    miles?: string;
    hours?: string;
    notes?: string;
    no_of_luggage?: string;
    no_of_passengers?: string;
    child_seat_count?: string;
  } = {
    luggage_type: undefined,
    occasion_type: undefined,
    greeting_sign: undefined,
    greeting_sign_text: undefined,
    notes_to_driver: undefined,
    child_seat: undefined
  };

  isPopupOpen: boolean = false;
  modalTitle: string = '';
  modalContent: string = '';
  showInfoModal: boolean = false;

  constructor() {}

  // Open the popup with dynamic content
  openPopup(type: string) {
    this.isPopupOpen = true;

    switch (type) {
      case 'luggage':
        this.modalTitle = 'No. Of Luggage';
        this.modalContent = this.extraInfo.no_of_luggage
          ? `No. Of Luggage = ${this.extraInfo.no_of_luggage}`
          : 'No luggage information available';
        break;
      case 'passengers':
        this.modalTitle = 'No. Of Passengers';
        this.modalContent = this.extraInfo.no_of_passengers
          ? `No. Of Passengers = ${this.extraInfo.no_of_passengers}`
          : 'No passenger information available';
        break;
      case 'child':
      case 'child_seat':
        this.modalTitle = 'No. Of Child Seats';
        this.modalContent = this.extraInfo.child_seat_count
          ? `No. Of Child Seats = ${this.extraInfo.child_seat_count}`
          : 'No child seat information available';
        break;
      default:
        this.modalTitle = 'Info';
        this.modalContent = 'No information available';
    }
  }


  openMoreInfo() {
    this.showInfoModal = true;
  }

  closeMoreInfo() {
    this.showInfoModal = false;
  }
  // Close the popup
  closePopup() {
    this.isPopupOpen = false;
  }
}
