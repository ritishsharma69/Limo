import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeadlineCompComponent } from '../headline-comp.component';
import { ApiService } from 'src/app/services/api.service';

interface AdditionalCost {
  name: string;
  amount: number | null;
  addedToPayment: boolean;
}

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
  additionalCosts: AdditionalCost[] = [
    { name: '', amount: null, addedToPayment: false },
  ];
  successfulCosts: { name: string; amount: number | null }[] = [];
  submitted: boolean = false;
  isPaymentAdded: boolean = false;
  showErrorPopup: boolean = false;
  showSuccessMessage: boolean = false;
  private apiService = inject(ApiService);
  private router = inject(Router);

  ngOnInit() {
    this.calculateTotalAdditionalPayment();
  }

  getTotalRemainingPaymentWithoutWaitingTime(): number {
    return (
      this.remainingPayment +
      this.successfulCosts.reduce(
        (total, cost) => total + (cost.amount || 0),
        0
      )
    );
  }

  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
    this.showErrorPopup =
      this.additionalCosts.length > 0 && !this.isPaymentAdded;
    this.collectedAmount = null;
    this.otherPaymentDetails = null;
  }

  getTotalRemainingPayment(): number {
    return (
      this.remainingPayment -
      this.totalAdditionalPayment +
      (this.waitingCost || 0)
    );
  }

  finalizePayment() {
    this.submitted = true;

    if (!this.isPaymentAdded) {
      this.paymentStatus =
        'Please add costs and press "Add to Payment" before finalizing.';
      return;
    }

    if (!this.isFormValid()) {
      this.paymentStatus = 'Please complete all required fields.';
      return;
    }

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
    this.additionalCosts.push({
      name: '',
      amount: null,
      addedToPayment: false,
    });
  }

  removeCost(index: number) {
    if (!this.additionalCosts[index].addedToPayment) {
      this.additionalCosts.splice(index, 1);
    } else {
      this.paymentStatus =
        'Cannot delete a cost that has been added to payment.';
    }
  }

  calculateTotalAdditionalPayment() {
    this.totalAdditionalPayment = this.additionalCosts.reduce(
      (total, cost) => total + (cost.addedToPayment ? cost.amount || 0 : 0),
      0
    );
  }

  isFormValid(): boolean {
    const allCostsValid = this.additionalCosts.every(
      (cost) =>
        cost.addedToPayment ||
        (!!cost.name && cost.amount !== null && cost.amount > 0)
    );

    const paymentMethodValid =
      this.selectedPaymentMethod === 'cash'
        ? this.collectedAmount !== null && this.collectedAmount > 0
        : this.selectedPaymentMethod === 'other'
        ? !!this.otherPaymentDetails && this.otherPaymentDetails.trim() !== ''
        : this.selectedPaymentMethod !== null;

    return allCostsValid && paymentMethodValid;
  }

  isCostInvalid(cost: AdditionalCost): boolean {
    return (
      this.submitted &&
      !cost.addedToPayment &&
      (!cost.name || cost.amount === null || cost.amount <= 0)
    );
  }

  getTotalRemainingCost(): number {
    const remainingPayment = 500; // Fixed value
    const totalAdditionalPayment = this.successfulCosts.reduce((total, cost) => total + (cost.amount || 0), 0);
    return remainingPayment + totalAdditionalPayment;
  }
  

  isCostValid(cost: AdditionalCost): boolean {
    return (
      !cost.addedToPayment &&
      !!cost.name &&
      cost.amount !== null &&
      cost.amount > 0
    );
  }

  addCostToPayment(cost: AdditionalCost) {
    if (!cost.name || cost.amount === null || cost.amount <= 0) {
      this.paymentStatus = 'Please fill out the cost name and valid amount.';
      return;
    }

    const rates = [
      {
        name: cost.name,
        fixed_amount: cost.amount,
      },
    ];

    if (!this.booking_id) {
      this.paymentStatus = 'Please enter a booking ID.';
      return;
    }

    this.apiService.addAdditionalCost(this.booking_id, rates).subscribe({
      next: () => {
        this.isPaymentAdded = true;

        this.successfulCosts.push({ name: cost.name, amount: cost.amount });

        cost.addedToPayment = true;

        this.showSuccessMessage = true;
        console.log('Payment submitted successfully');
      },
      error: () => {
        this.paymentStatus =
          'There was an error processing your payment. Please try again.';
      },
    });
  }
}
