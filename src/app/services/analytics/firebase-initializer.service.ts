import { Injectable } from '@angular/core';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { Capacitor } from '@capacitor/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseInitializerService {
  async initialize() {
    if (Capacitor.isNativePlatform()) {
      try {
        await FirebaseAnalytics.initializeFirebase({
          apiKey: environment.firebase.apiKey,
          authDomain: environment.firebase.authDomain,
          projectId: environment.firebase.projectId,
          storageBucket: environment.firebase.storageBucket,
          messagingSenderId: environment.firebase.messagingSenderId,
          appId: environment.firebase.appId,
          measurementId: environment.firebase.measurementId,
        });
        console.log('Firebase initialized successfully');
      } catch (error) {
        console.error('Error initializing Firebase:', error);
      }
    }
  }

  logEvent(eventName: string, params?: any) {
    if (Capacitor.isNativePlatform()) {
      FirebaseAnalytics.logEvent({ name: eventName, params });
    }
  }

  logPageView(pageName: string) {
    this.logEvent('page_view', { page_path: pageName });
  }

  logLoginEvent(method: string) {
    this.logEvent('login', { method });
  }
  
}
