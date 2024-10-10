import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
  ],
})
export class LoginComponent implements OnInit {
  router = inject(Router);
  http = inject(HttpClient);
  alertCtrl = inject(AlertController);
  loadingCtrl = inject(LoadingController);
  commonService = inject(CommonService);
  appService = inject(AppService);
  analyticss = inject(Analytics);
  firebaseInitializer = inject(FirebaseInitializerService);
  notificationService = inject(NotificationService);
  permissionService = inject(PermissionService);

  showPassword: boolean = false;

  userData = {
    email: 'padberg.sheldon@example.net',
    password: 'Pass@123',
  };

  constructor() {}

  ngOnInit() {}

  toggleShow() {
    this.showPassword = !this.showPassword;
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

    // await this.commonService.showLoader();

    const postData = { email, password };

    this.http
      .post<LoginResponse>(`${environment.API_ENDPOINT}/api/login`, postData)
      .subscribe({
        next: (data) => {
          // this.commonService.hideLoader();

          if (data.success && data.data) {
            const { token, user } = data.data;

            if (user?.role_id !== undefined) {
              console.log(user.role_id);
              localStorage.setItem('userData', JSON.stringify(user));
              localStorage.setItem('token', token);
              localStorage.setItem('role', user.role_id.toString());

              this.permissionService.getCurrentLocation();
              // Request notification permissions after successful login
              this.notificationService.initPushNotifications();

              // Log login success event in Firebase Analytics
              // logEvent(this.analytics, 'login_success', {
              //   email: email,
              //   role_id: user.role_id,
              // });

              // Different way to track ?.
              const analytics = getAnalytics();
              logEvent(analytics, 'login', {
                method: 'Email',
                email: user.email,
                role_id: user.role_id,
              });

              // Log login success event in Firebase Analytics
              this.firebaseInitializer.logLoginEvent('Email'); // Log login event

              this.router.navigate(['/dashboard/pending']);
            }
          }
        },
        error: (error) => {
          // this.commonService.hideLoader();
          console.error('Login error:', error);

          const errorMessage =
            error.error?.success === false
              ? error.error.message || 'No user data received.'
              : 'Something went wrong, please try again.';

          this.commonService.showAlert('Login Failed', errorMessage);

          // Different way to track ?.
          // Log login failure event in Firebase Analytics
          logEvent(this.analyticss, 'login_failed', {
            email: email,
            error_message: errorMessage,
          });

          this.firebaseInitializer.logLoginEvent('Email'); // Log failed login attempt
        },
        complete: () => {
          // this.commonService.hideLoader();
        },
      });
  }
}
