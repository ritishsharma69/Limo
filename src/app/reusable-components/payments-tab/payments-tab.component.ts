import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';  // Import Router

import { HeadlineCompComponent } from '../headline-comp.component';

@Component({
  selector: 'app-payments-tab',
  templateUrl: './payments-tab.component.html',
  styleUrls: ['./payments-tab.component.scss'],
  standalone: true,
  imports: [
    HeadlineCompComponent,
    FormsModule,
    CommonModule
  ]
})
export class PaymentsTabComponent implements OnInit {

  remainingPayment = 500; 
  additionalCost: number | null = null; 
  currencySymbol = '$';
  selectedPaymentMethod: string | null = null;
  collectedAmount: number | null = null;
  otherPaymentDetails: string | null = null;
  paymentStatus: string | null = null;

  constructor(private router: Router) { }  // Inject Router here

  ngOnInit() {}

  setPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
    this.collectedAmount = null;
    this.otherPaymentDetails = null;
  }

  getTotalRemainingPayment(): number {
    return this.remainingPayment + (this.additionalCost ?? 0);
  }

  finalizePayment() {
    if (this.selectedPaymentMethod === 'cash' && this.collectedAmount !== null) {
      this.paymentStatus = `Transaction Successful! Cash Collected: ${this.collectedAmount} ${this.currencySymbol}`;
    } else if (this.selectedPaymentMethod === 'card') {
      this.paymentStatus = 'Transaction Successful! Charged to Card.';
    } else if (this.selectedPaymentMethod === 'other' && this.otherPaymentDetails) {
      this.paymentStatus = `Transaction Successful! Other Payment: ${this.otherPaymentDetails}`;
    } else {
      this.paymentStatus = 'Please select a payment method and enter the required details.';
    }

    this.router.navigate(['/payment-status']);

  }
}
