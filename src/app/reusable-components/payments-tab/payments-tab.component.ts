import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeadlineCompComponent } from '../headline-comp.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-payments-tab',
  templateUrl: './payments-tab.component.html',
  styleUrls: ['./payments-tab.component.scss'],
  standalone: true,
  imports: [HeadlineCompComponent, FormsModule, CommonModule],
})
export class PaymentsTabComponent implements OnInit {
  @Input() waitingCost: number | undefined;
  @Input() booking_id: string | undefined;
  remainingPayment: number = 500;
  currencySymbol: string = '$';
  selectedPaymentMethod: string | null = null;
  collectedAmount: number | null = null;
  otherPaymentDetails: string | null = null;
  paymentStatus: string | null = null;
  totalAdditionalPayment: number = 0;
  additionalCosts: { name: string; amount: number | null }[] = [
    { name: '', amount: null },
  ];
  submitted: boolean = false;

  private apiService = inject(ApiService);
  private router = inject(Router);

  constructor() {}

  ngOnInit() {
    this.calculateTotalAdditionalPayment();
  }

  setPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
    this.collectedAmount = null;
    this.otherPaymentDetails = null;
  }

  getTotalRemainingPayment(): number {
    return (
      this.remainingPayment +
      this.totalAdditionalPayment +
      (this.waitingCost || 0)
    );
  }

  finalizePayment() {
    this.submitted = true;

    if (!this.isFormValid()) {
      this.paymentStatus = 'Please complete all required fields.';
      return;
    }

    const additionalCostsData = this.additionalCosts.map((cost) => ({
      name: cost.name,
      amount: cost.amount,
    }));
    console.log('Additional Costs Data:', additionalCostsData);

    const totalPaid = this.calculateTotalPaid();
    if (totalPaid === null) {
      this.paymentStatus = 'Please enter the required payment details.';
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
      (this.selectedPaymentMethod === 'cash' &&
        this.collectedAmount &&
        this.collectedAmount > 0) ||
      this.selectedPaymentMethod === 'card' ||
      (this.selectedPaymentMethod === 'other' && this.otherPaymentDetails)
    ) {
      return this.getTotalRemainingPayment();
    }
    return null;
  }

  addCost() {
    this.additionalCosts.push({ name: '', amount: null });
    this.calculateTotalAdditionalPayment();
  }

  removeCost(index: number) {
    this.additionalCosts.splice(index, 1);
    this.calculateTotalAdditionalPayment();
  }

  calculateTotalAdditionalPayment() {
    this.totalAdditionalPayment = this.additionalCosts.reduce(
      (total, cost) => total + (cost.amount || 0),
      0
    );
  }

  isFormValid(): boolean {
    const allCostsValid = this.additionalCosts.every(
      (cost) => !!cost.name && cost.amount !== null && cost.amount > 0
    );

    const paymentMethodValid =
      this.selectedPaymentMethod === 'cash'
        ? this.collectedAmount !== null && this.collectedAmount > 0
        : this.selectedPaymentMethod === 'other'
        ? !!this.otherPaymentDetails && this.otherPaymentDetails.trim() !== ''
        : this.selectedPaymentMethod !== null;

    return allCostsValid || paymentMethodValid;
  }

  // Helper method to determine if a specific cost is invalid
  isCostInvalid(cost: { name: string; amount: number | null }): boolean {
    return (
      !!this.submitted &&
      (!cost.name || cost.amount === null || cost.amount <= 0)
    );
  }
  addToPayment() {
    const rates = this.additionalCosts.map((cost) => ({
      name: cost.name,
      fixed_amount: cost.amount,
    }));
    console.log('Additional Costs Data:', rates);

    if (!this.booking_id) {
      this.paymentStatus = 'Please enter a booking ID.';
      return;
    }

    this.apiService.submitPayment(this.booking_id, rates).subscribe({
      next: (response) => {
        console.log('Payment submitted successfully', response);

        // Calculate the total paid amount
        const totalPaid = this.calculateTotalPaid();
        if (totalPaid === null) {
          this.paymentStatus = 'Please enter the required payment details.';
          return;
        }
      },
      error: (err) => {
        console.error('Payment submission failed', err);
        this.paymentStatus =
          'There was an error processing your payment. Please try again.';
      },
    });
  }
}
