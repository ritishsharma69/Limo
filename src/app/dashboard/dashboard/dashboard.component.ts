import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { FirebaseInitializerService } from 'src/app/services/analytics/firebase-initializer.service';
import {
  IonSegment,
  IonSegmentButton,
  IonToolbar,
  IonHeader,
  IonContent,
  IonRouterOutlet,
  IonButtons,
  IonToggle,
  IonMenuButton,
  MenuController,
  IonApp,
} from '@ionic/angular/standalone';
import { IUser } from 'src/app/model/interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    IonApp,
    IonMenuButton,
    IonToggle,
    IonButtons,
    CommonModule,
    FormsModule,
    IonSegment,
    IonSegmentButton,
    IonToolbar,
    IonHeader,
    IonContent,
    IonRouterOutlet,
    RouterLink,
  ],
})
export class DashboardComponent implements OnInit {
profileImage: any;
openProfileImageModal() {
throw new Error('Method not implemented.');
}
  userData: IUser = {};
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  isOnDuty: boolean = false;
  selectedSegment: string = 'pending';
  route = inject(Router);
  pendingNotifications: number = 5;
  upcomingNotifications: number = 5;
  inProgressNotifications: number = 0;

  constructor(
    private router: Router,
    private renderer: Renderer2, // Renderer for DOM manipulation
    private firebaseInitializer: FirebaseInitializerService
  ) {}

  ngOnInit() {
    this.loadUserData();

    // Trigger full-name animation when the component loads
    const nameElement = document.querySelector('.full-name-animation');
    if (nameElement) {
      this.renderer.addClass(nameElement, 'animate'); // Start animation when loaded
    }

    // Load isOnDuty state from localStorage if it exists
    const savedOnDutyState = localStorage.getItem('isOnDuty');
    if (savedOnDutyState !== null) {
      this.isOnDuty = JSON.parse(savedOnDutyState);
    }

    // Subscribe to route changes to update the selected segment
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateSelectedSegment(event.url);
      }
    });
  }

  private updateSelectedSegment(url: string): void {
    const segments = ['pending', 'upcoming', 'in-progress'];
    this.selectedSegment =
      segments.find((segment) => url.includes(`/dashboard/${segment}`)) ||
      'pending';
  }

  // Method to navigate to the selected segment
  segmentChanged(event: CustomEvent): void {
    const selectedValue = event.detail.value;
    this.router.navigate([`/dashboard/${selectedValue}`]);
  }

  onToggleChange(event: CustomEvent) {
    this.isOnDuty = event.detail.checked;
    console.log('On Duty:', this.isOnDuty);

    // Save the state to localStorage
    localStorage.setItem('isOnDuty', JSON.stringify(this.isOnDuty));

    // Log the "On Duty" or "Off Duty" event to Firebase
    const dutyStatus = this.isOnDuty ? 'On Duty' : 'Off Duty';
    this.firebaseInitializer.logEvent('duty_status_change', {
      status: dutyStatus,
      email: this.email,
    });
  }

  loadUserData() {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        this.userData = JSON.parse(userDataString);
        this.firstName = this.userData.f_name;
        this.lastName = this.userData.l_name;
        this.email = this.userData.email;
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    }
  }

}
