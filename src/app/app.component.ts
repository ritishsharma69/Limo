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
import { CommonModule, DatePipe } from '@angular/common';
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
import { NavController } from '@ionic/angular';
import { App } from '@capacitor/app';
import { CommonService } from './services/common.service';
import { IframeService } from './services/Iframe.service';

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
  private backButtonSubscription: any;
  public showIframe: boolean = false;

  constructor(
    private router: Router,
    private platform: Platform,
    private firebaseInitializer: FirebaseInitializerService,
    private navigationTrackingService: NavigationTrackingService,
    // private crashlytics: AngularFireCrashlytics,
    private navCtrl: NavController,
    private commonService: CommonService,
    private iframeService: IframeService,
  ) {}

  ngOnInit() {
    this.initializeApp();

    this.trackNavigationEvents();

    // this.iframeService.iframeVisible$.subscribe((isVisible) => {
    //   this.showIframe = isVisible; // Update local state
    // });

    this.backButtonSubscription =
      this.platform.backButton.subscribeWithPriority(10, async () => {
        const currentUrl = this.router.url;

        if (currentUrl === '/dashboard/pending' || currentUrl === '/login') {
          const confirmed = await this.commonService.alertConfirm(
            'Confirm Exit',
            'Are you sure you want to exit the app?'
          );
          if (confirmed) {
            App.exitApp();
          }
        } else {
          this.navCtrl.back();
        }
      });
  //   this.backButtonSubscription =
  // this.platform.backButton.subscribeWithPriority(10, async () => {
  //   const currentUrl = this.router.url;

  //   if (this.showIframe) {
  //     // If the iframe is open, use the iframe's history
  //     if (window.history.length > 1) {
  //       window.history.back(); // Go back in iframe history
  //     } else {
  //       this.showIframe = false; // Close the iframe if there's no history
  //     }
  //   } else if (currentUrl === '/dashboard/pending' || currentUrl === '/login') {
  //     const confirmed = await this.commonService.alertConfirm(
  //       'Confirm Exit',
  //       'Are you sure you want to exit the app?'
  //     );
  //     if (confirmed) {
  //       App.exitApp();
  //     }
  //   } else {
  //     this.navCtrl.back();
  //   }
  // });


    FirebaseAnalytics.initializeFirebase(environment.firebase).then((res) => {
      console.log(res);
    });
  }

  // ngOnDestroy() {
  //   // Unsubscribe from back button event
  //   if (this.backButtonSubscription) {
  //     this.backButtonSubscription.unsubscribe();
  //   }
  // }

  public appPages = [
    {
      title: 'Dashboard',
      url: '/dashboard/pending',
      icon: 'fa-solid fa-house-chimney',
    },
    {
      title: 'Driver Profile',
      url: '/driver-profile',
      icon: 'fa-regular fa-id-card',
    },
    {
      title: 'Trip History',
      url: '/trip-history',
      icon: 'fa-solid fa-clock-rotate-left',
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
