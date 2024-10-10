import { Routes } from '@angular/router';
import { loginGaurdGuard } from './services/loginGaurd.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/pending',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [loginGaurdGuard],
    children: [
      {
        path: 'pending',
        loadComponent: () =>
          import('./dashboard/pending/pending.component').then(
            (m) => m.PendingComponent
          ),
      },
      {
        path: 'upcoming',
        loadComponent: () =>
          import('./dashboard/upcoming/upcoming.component').then(
            (m) => m.UpcomingComponent
          ),
      },
      {
        path: 'in-progress',
        loadComponent: () =>
          import('./dashboard/in-progress/in-progress.component').then(
            (m) => m.InProgressComponent
          ),
      },
    ],
  },
  {
    path: 'driver-profile',
    loadComponent: () =>
      import('./driver-profile/driver-profile.component').then(
        (m) => m.DriverProfileComponent
      ),
  },
  {
    path: 'trip-history',
    loadComponent: () =>
      import('./trip-history/trip-history.component').then(
        (m) => m.TripHistoryComponent
      ),
  },
  {
    path: 'trip-detail',
    loadComponent: () =>
      import('./single-trip-detail/single-trip-detail.component').then(
        (m) => m.SingleTripDetailComponent
      ),
  },
  {
    path: 'payment-status',
    loadComponent: () =>
      import(
        './payment-confirmation-page/payment-confirmation-page.component'
      ).then((m) => m.PaymentConfirmationPageComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('./logout/logout.component').then((m) => m.LogoutComponent),
  },
  {
    path: '**',
    redirectTo: 'dashboard/pending',
  },
];
