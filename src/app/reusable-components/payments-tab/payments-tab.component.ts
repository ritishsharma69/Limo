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
  isPaymentAdded: boolean = false;
  showAddToPaymentPrompt: boolean = false;

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

  getTotalRemainingPaymentWithoutWaitingTime(): number {
    return this.remainingPayment + this.totalAdditionalPayment;
  }

  finalizePayment() {
    this.submitted = true;

    // Check if the payment has been added before proceeding
    if (!this.isPaymentAdded) {
      this.paymentStatus =
        'Please add costs and press "Add to Payment" before finalizing.';
      return;
    }

    // Validate the payment form
    if (!this.isFormValid()) {
      this.paymentStatus = 'Please complete all required fields.';
      return;
    }

    const totalPaid = this.calculateTotalPaid();
    if (totalPaid === null) {
      this.paymentStatus = 'Please enter the required payment details.';
      return;
    }

    // Navigate to the payment status page with payment data
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
    this.checkForAddToPaymentPrompt(); // Check for prompt after adding a cost

    if (this.additionalCosts.length > 0) {
      this.isPaymentAdded = false;
    }
  }

  removeCost(index: number) {
    this.additionalCosts.splice(index, 1);
    this.calculateTotalAdditionalPayment();
    this.checkForAddToPaymentPrompt(); // Check for prompt after removing a cost

    if (this.additionalCosts.length === 0) {
      this.isPaymentAdded = true;
    }
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

    return allCostsValid && paymentMethodValid;
  }

  isCostInvalid(cost: { name: string; amount: number | null }): boolean {
    return (
      !!this.submitted &&
      (!cost.name || cost.amount === null || cost.amount <= 0)
    );
  }

  addToPayment() {
    const allCostsValid = this.additionalCosts.every(
      (cost) => !!cost.name && cost.amount !== null && cost.amount > 0
    );

    if (!allCostsValid) {
      this.paymentStatus = 'Please fill out all cost names and valid amounts.';
      return;
    }

    const rates = this.additionalCosts.map((cost) => ({
      name: cost.name,
      fixed_amount: cost.amount,
    }));

    if (!this.booking_id) {
      this.paymentStatus = 'Please enter a booking ID.';
      return;
    }

    this.apiService.addAdditionalCost(this.booking_id, rates).subscribe({
      next: () => {
        this.isPaymentAdded = true;
        this.showAddToPaymentPrompt = false; 
        console.log('Payment submitted successfully');
      },
      error: () => {
        this.paymentStatus =
          'There was an error processing your payment. Please try again.';
      },
    });
  }

  checkForAddToPaymentPrompt() {
    this.showAddToPaymentPrompt = this.additionalCosts.some(cost =>
      cost.name && cost.amount !== null && cost.amount > 0
    );
  }
}

