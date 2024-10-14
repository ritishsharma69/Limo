import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeadlineCompComponent } from '../headline-comp.component';

@Component({
  selector: 'app-payments-tab',
  templateUrl: './payments-tab.component.html',
  styleUrls: ['./payments-tab.component.scss'],
  standalone: true,
  imports: [HeadlineCompComponent, FormsModule, CommonModule],
})
export class PaymentsTabComponent implements OnInit {

  remainingPayment: number = 500;
  additionalCost: number | null = null;
  currencySymbol: string = '$';
  selectedPaymentMethod: string | null = null;
  collectedAmount: number | null = null;
  otherPaymentDetails: string | null = null;
  paymentStatus: string | null = null;
  totalAdditionalPayment: number = 0;
  additionalCosts: { name: string; amount: number }[] = [{ name: '', amount: 0 }];
  constructor(private router: Router) {}

  ngOnInit() {
    this.calculateTotalAdditionalPayment();
  }



  setPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
    this.collectedAmount = null;
    this.otherPaymentDetails = null;
  }

  getTotalRemainingPayment(): number {
    return this.remainingPayment + this.totalAdditionalPayment;
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

  addCost() {
    this.additionalCosts.push({ name: '', amount: 0 });
    this.calculateTotalAdditionalPayment();
  }

  removeCost(index: number) {
    this.additionalCosts.splice(index, 1);
    this.calculateTotalAdditionalPayment();
  }

  calculateTotalAdditionalPayment() {
    this.totalAdditionalPayment = this.additionalCosts.reduce(
      (total, cost) => total + cost.amount,
      0
    );
  }
  
}
