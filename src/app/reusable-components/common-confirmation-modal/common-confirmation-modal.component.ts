import { IonModal, IonButton, IonTitle, IonText } from '@ionic/angular/standalone';
import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-common-confirmation-modal',
  templateUrl: './common-confirmation-modal.component.html',
  styleUrls: ['./common-confirmation-modal.component.scss'],
  standalone: true,
  imports: [IonText, IonModal, IonButton, IonTitle, CommonModule],
})
export class CommonConfirmationModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() actionTitle = '';
  @Input() actionText = '';
  @Output() confirmAction = new EventEmitter<boolean>();
  @Output() isOpenChange = new EventEmitter<boolean>();

  countdown = 3;
  private countdownSubscription: Subscription | null = null;

  ngOnInit() {}

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.startCountdown();
    }
  }

  startCountdown() {
    this.countdown = 5;
    this.countdownSubscription?.unsubscribe();
    
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.countdownSubscription?.unsubscribe();
        this.confirm(true);
      }
    });
  }

  confirm(isConfirmed: boolean) {
    this.confirmAction.emit(isConfirmed);
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen);
    this.countdownSubscription?.unsubscribe();
  }

  cancel() {
    this.confirm(false);
  }

  onWillDismiss() {
    if (this.isOpen) {
      this.isOpen = false;
      this.isOpenChange.emit(this.isOpen);
      this.countdownSubscription?.unsubscribe();
    }
  }
}
