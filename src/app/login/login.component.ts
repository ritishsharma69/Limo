import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  LoadingController,
  AlertController,
} from '@ionic/angular/standalone';
import { LoginResponse } from '../model/interface';
import { CommonService } from '../services/common.service';
import { AppService } from '../services/auth.service';
import { Analytics, getAnalytics, logEvent } from '@angular/fire/analytics';
import { FirebaseInitializerService } from '../services/analytics/firebase-initializer.service';
import { NotificationService } from '../services/notification/notification.service';
import { PermissionService } from '../services/permission.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonLabel,
    IonItem,
    IonInput,
    IonButton,
    FormsModule,
    RouterLink,
    CommonModule,
  ],
})
export class LoginComponent implements OnInit {
  router = inject(Router);
  http = inject(HttpClient);
  alertCtrl = inject(AlertController);
  loadingCtrl = inject(LoadingController);
  commonService = inject(CommonService);
  appService = inject(AppService);
  analytics = inject(Analytics);
  firebaseInitializer = inject(FirebaseInitializerService);
  notificationService = inject(NotificationService);
  permissionService = inject(PermissionService);
  sanitizer = inject(DomSanitizer);

  showPassword: boolean = false;
  showIframe: boolean = false;
  iframeUrl: SafeResourceUrl;

  userData = {
    email: '',
    password: '',
  };

  constructor() {
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      environment.iframeUrl
    );
  }

  ngOnInit() {
    this.userData.email = 'padberg.sheldon@example.net';
    this.userData.password = 'Pass@123';
  }

  toggleShow() {
    this.showPassword = !this.showPassword;
  }

  openWeb() {
    this.showIframe = true;
  }

  async handleLogin() {
    const { email, password } = this.userData;

    if (!email || !password) {
      this.commonService.showAlert(
        'Input Error',
        'Please enter both email and password.'
      );
      return;
    }

    const postData = { email, password };

    this.http
      .post<LoginResponse>(`${environment.API_ENDPOINT}/api/login`, postData)
      .subscribe({
        next: async (data) => {
          console.log(data);

          if (data.success && data.data) {
            const { token, user } = data.data;

            if (user?.role_id !== undefined) {
              localStorage.setItem('userData', JSON.stringify(user));
              localStorage.setItem('token', token);
              localStorage.setItem('role', user.role_id.toString());

              const analytics = getAnalytics();
              logEvent(analytics, 'login', {
                method: 'Email',
                email: user.email,
                role_id: user.role_id,
              });

              if (user.role_id === 3) {
                this.router.navigate(['/dashboard/pending']);
                await this.handlePermissions();
              } else {
                this.openWeb();
              }
            }
          }
        },
        error: (error) => {
          const errorMessage =
            error.error?.success === false
              ? error.error.message || 'No user data received.'
              : 'Something went wrong, please try again.';

          this.commonService.showAlert('Login Failed', errorMessage);
          logEvent(this.analytics, 'login_failed', {
            email: email,
            error_message: errorMessage,
          });
        },
      });
  }

  private async handlePermissions() {
    try {
      await this.notificationService.initPushNotifications();
      await this.permissionService.getCurrentLocation();
    } catch (error) {
      console.error(
        'Error while requesting permissions or notifications:',
        error
      );
    }
  }
}
