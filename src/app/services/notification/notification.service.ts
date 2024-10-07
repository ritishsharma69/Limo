// notification.service.ts
import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Router, NavigationExtras } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private router: Router) {
    // Optionally, you can call initPushNotifications here if you want to set it up immediately.
  }

  // Change the visibility of this method to public
  public initPushNotifications() {
    PushNotifications.requestPermissions().then((result) => {
      console.log('Permission request result:', result);
      if (result.receive === 'granted') {
        PushNotifications.register();

        // Handle incoming notifications
        this.handlePushNotifications();
      } else {
        console.error('Push notification permission not granted');
      }
    });
  }

  private handlePushNotifications() {

    PushNotifications.addListener('registration', (token) => {
      console.log('Device registered with token:', token.value);
      // Optionally, send this token to your backend server for targeting
    });

    // Listener for registration errors
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error registering for push notifications:', error);
    });
    
    // Listener for incoming notifications
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received:', notification);
      // Optionally show a toast or alert
    });

    // Listener for notification action performed (when tapped)
    // PushNotifications.addListener('pushNotificationActionPerformed', async (action) => {
    //   console.log('Push notification action performed:', action);
    //   const data = action.notification.data;

    //   if (data.url) {
    //     const navigationExtras: NavigationExtras = {
    //       queryParams: {
    //         contentId: data.id,
    //       },
    //     };
    //     await this.router.navigate([data.url], navigationExtras);
    //   } else {
    //     console.warn('No URL provided in notification data. Handling default action.');
    //     await this.router.navigate(['/login']); 
    //   }
    // });

    PushNotifications.addListener('pushNotificationActionPerformed', async (action) => {
      console.log('Push notification action performed:', action);
      console.log('Push notification action performed:', action.notification);
      console.log('Push notification action performed:', action.notification.data);
      const data = action.notification.data;

      if (data && data.url) {

        const navigationExtras: NavigationExtras = {
          queryParams: {
            contentId: data.ContentId
          }
        }

        console.log('Navigating to:', data.url);
        await this.router.navigate([data.url], navigationExtras);
      } else {
        console.warn('No URL provided in notification data. Handling default action.');
        await this.router.navigate(['/dashboard/pending']); 
      }
    });
  }
}