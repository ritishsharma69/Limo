import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FirebaseInitializerService } from './firebase-initializer.service';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NavigationTrackingService {
  constructor(
    private router: Router,
    private firebaseInitializer: FirebaseInitializerService
  ) {}

  trackPageViews(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ) // Filter NavigationEnd events
      )
      .subscribe((event: NavigationEnd) => {
        // Log the page view to Firebase Analytics
        this.firebaseInitializer.logPageView(event.urlAfterRedirects);
      });
  }
}
