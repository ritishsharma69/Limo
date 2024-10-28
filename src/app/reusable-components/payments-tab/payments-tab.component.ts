import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeadlineCompComponent } from '../headline-comp.component';
import { ApiService } from 'src/app/services/api.service';

interface AdditionalCost {
  name: string;
  amount: number | null;
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
  newCostName: string = '';
  newCostAmount: number | null = null;
  successfulCosts: AdditionalCost[] = [];
  submitted: boolean = false;
  isPaymentAdded: boolean = false;
  showErrorPopup: boolean = false;
  showSuccessMessage: boolean = false;
  private apiService = inject(ApiService);
  private router = inject(Router);

  ngOnInit() {}

  addCost() {
    if (!this.newCostName || this.newCostAmount === null || this.newCostAmount <= 0) {
      this.paymentStatus = 'Please fill out the cost name and valid amount.';
      return;
    }

    this.successfulCosts.push({
      name: this.newCostName,
      amount: this.newCostAmount,
    });

    // Reset the input fields after adding
    this.newCostName = '';
    this.newCostAmount = null;

    this.showSuccessMessage = true;
  }

  finalizeAdditionalCosts() {
    if (this.successfulCosts.length === 0) {
      this.paymentStatus = 'No additional costs to finalize.';
      return;
    }

    const rates = this.successfulCosts.map(cost => ({
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
        this.showSuccessMessage = true;
        console.log('All additional costs submitted successfully.');
      },
      error: (err) => {
        console.error('Error submitting additional costs:', err);
        this.paymentStatus = 'Error while finalizing costs.';
      },
    });

    // Clear the costs after finalizing
    this.successfulCosts = [];
  }

  getTotalRemainingPaymentWithoutWaitingTime(): number {
    return (
      this.remainingPayment +
      this.successfulCosts.reduce((total, cost) => total + (cost.amount || 0), 0)
    );
  }

  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
    this.collectedAmount = null;
    this.otherPaymentDetails = null;
  }

  getTotalRemainingCost(): number {
    return this.remainingPayment + this.getTotalAdditionalCost();
  }

  getTotalAdditionalCost(): number {
    return this.successfulCosts.reduce((total, cost) => total + (cost.amount || 0), 0);
  }

  finalizePayment() {
    this.submitted = true;

    if (!this.isFormValid() && this.successfulCosts.length > 0) {
      this.paymentStatus = 'Please complete all required fields.';
      return;
    }

    const totalPaid = this.calculateTotalPaid();
    if (totalPaid === null) {
      this.paymentStatus = 'Please enter the required payment details.';
      return;
    }

    const totalRemainingPayment = this.getTotalRemainingPaymentWithoutWaitingTime();

    this.router.navigate(['/payment-status'], {
      state: {
        remainingPayment: totalRemainingPayment,
        paymentMethod: this.selectedPaymentMethod,
        currencySymbol: this.currencySymbol,
        otherPaymentDetails: this.otherPaymentDetails,
      },
    });
  }

  private calculateTotalPaid(): number | null {
    if (
      (this.selectedPaymentMethod === 'cash' && this.collectedAmount && this.collectedAmount > 0) ||
      this.selectedPaymentMethod === 'card' ||
      (this.selectedPaymentMethod === 'other' && this.otherPaymentDetails)
    ) {
      return this.getTotalRemainingPaymentWithoutWaitingTime();
    }
    return null;
  }

  isFormValid(): boolean {
    const allCostsValid = this.successfulCosts.every(
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

  removeSuccessfulCost(index: number) {
    this.successfulCosts.splice(index, 1);
  }
}
