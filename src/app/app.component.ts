import { Component, OnInit } from '@angular/core';
import {
  IonListHeader,
  IonLabel,
  IonApp,
  IonContent,
  IonRouterOutlet,
  IonMenu,
  IonMenuToggle,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { PendingComponent } from './dashboard/pending/pending.component';
import { UpcomingComponent } from './dashboard/upcoming/upcoming.component';
import { InProgressComponent } from './dashboard/in-progress/in-progress.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { FirebaseInitializerService } from './services/analytics/firebase-initializer.service';
import { environment } from 'src/environments/environment';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { Platform } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { NavigationTrackingService } from './services/analytics/navigation-tracking.service';
// import { AngularFireCrashlytics } from '@angular/fire/crashlytics';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    IonRouterOutlet,
    IonContent,
    IonApp,
    IonMenuToggle,
    IonLabel,
    IonMenu,
    IonListHeader,
    CommonModule,
    FormsModule,
    RouterLink,
    PendingComponent,
    UpcomingComponent,
    InProgressComponent,
    DashboardComponent,
    LoginComponent,
    LogoutComponent,
    FormsModule,
    GoogleMapsModule,
  ],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private platform: Platform,
    private firebaseInitializer: FirebaseInitializerService,
    private navigationTrackingService: NavigationTrackingService,
    // private crashlytics: AngularFireCrashlytics,
  ) {}

  ngOnInit() {
    this.initializeApp();

    this.trackNavigationEvents();

    FirebaseAnalytics.initializeFirebase(environment.firebase).then((res) => {
      console.log(res);
    });
  }

  public appPages = [
    {
      title: 'Dashboard',
      url: '/dashboard/pending',
      icon: 'fa-solid fa-house-chimney',
    },
    {
      title: 'Logout',
      url: '/logout',
      icon: 'fa-solid fa-arrow-right-from-bracket',
    },
  ];

  isActive(url: string): boolean {
    if (
      url === '/dashboard/pending' ||
      url === '/dashboard/upcoming' ||
      url === '/dashboard/in-progress'
    ) {
      return this.router.url.startsWith('/dashboard');
    }
    return this.router.url === url;
  }

  async initializeApp() {
    await this.platform.ready();
    this.initializeFirebase(); // Call to initialize Firebase
  }

  async initializeFirebase() {
    try {
      await this.firebaseInitializer.initialize();
      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase: ', error);
    }
  }

  // Track page views during navigation
  trackNavigationEvents() {
    this.navigationTrackingService.trackPageViews();
  }
}
