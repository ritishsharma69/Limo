import { Component, Input } from '@angular/core';
import {
  IonCard,
  IonItem,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-pick-drop',
  templateUrl: './pick-drop.component.html',
  styleUrls: ['./pick-drop.component.scss'],
  standalone: true,
  imports: [
    IonItem, IonCard, IonItem, IonIcon, 
  ]

})
export class PickDropComponent   {

  @Input() pickupAddress: string = '';
  @Input() dropoffAddress: string = '';

  constructor() { }

  

}
