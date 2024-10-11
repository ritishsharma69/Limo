import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Import Router

import { HeadlineCompComponent } from '../headline-comp.component';

@Component({
  selector: 'app-payments-tab',
  templateUrl: './payments-tab.component.html',
  styleUrls: ['./payments-tab.component.scss'],
  standalone: true,
  imports: [HeadlineCompComponent, FormsModule, CommonModule],
})
export class PaymentsTabComponent implements OnInit {
  @Input() additionalPayment: number = 0;

  remainingPayment: number = 0;
  additionalCost: number | null = null;
  currencySymbol: string = '$';
  selectedPaymentMethod: string | null = null;
  collectedAmount: number | null = null;
  otherPaymentDetails: string | null = null;
  paymentStatus: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {}

  ngOnChanges() {
    this.updateRemainingPayment();
  }

  updateRemainingPayment() {
    this.remainingPayment = 500 + this.additionalPayment;
  }

  setPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
    this.collectedAmount = null;
    this.otherPaymentDetails = null;
  }

  getTotalRemainingPayment(): number {
    return this.remainingPayment + (this.additionalCost ?? 0);
  }

  finalizePayment() {
    const totalPaid = this.calculateTotalPaid();

    if (totalPaid === null) {
      this.paymentStatus =
        'Please select a payment method and enter the required details.';
      return;
    }

    this.router.navigate(['/payment-status'], {
      state: {
        remainingPayment: totalPaid,
        paymentMethod: this.selectedPaymentMethod,
        currencySymbol: this.currencySymbol,
        otherPaymentDetails: this.otherPaymentDetails,
      },
    });
  }

  private calculateTotalPaid(): number | null {
    if (
      this.selectedPaymentMethod === 'cash' ||
      this.selectedPaymentMethod === 'card' ||
      (this.selectedPaymentMethod === 'other' && this.otherPaymentDetails)
    ) {
      return this.getTotalRemainingPayment();
    }

    return null;
  }
}