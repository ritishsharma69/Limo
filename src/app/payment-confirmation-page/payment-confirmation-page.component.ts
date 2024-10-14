import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-confirmation-page',
  templateUrl: './payment-confirmation-page.component.html',
  styleUrls: ['./payment-confirmation-page.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class PaymentConfirmationPageComponent implements OnInit {
  amountPaid: number = 0;
  currencySymbol: string = '$';
  paymentMethod: string | null = null;
  otherPaymentDetails: string | null = null;
  today: Date = new Date();

  constructor(private router: Router) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.amountPaid = navigation.extras.state['remainingPayment'];
      this.currencySymbol =
        navigation.extras.state['currencySymbol'] || this.currencySymbol;
      this.paymentMethod = navigation.extras.state['paymentMethod'] || null;
      this.otherPaymentDetails =
        navigation.extras.state['otherPaymentDetails'] || null;
    }
  }
}
