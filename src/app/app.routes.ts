import { Routes } from '@angular/router';
import { loginGaurdGuard } from './guard/loginGaurd.guard';
import { roleGuard } from './guard/role.guard';

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
    canActivate: [loginGaurdGuard,],
    children: [
      {
        path: 'pending',
        loadComponent: () =>
          import('./dashboard/pending/pending.component').then(
            (m) => m.PendingComponent
          ),
          canActivate: [roleGuard],
          data: { roles: [3] },
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
      canActivate: [roleGuard],
      data: { roles: [3] },
  },
  {
    path: 'trip-history',
    loadComponent: () =>
      import('./trip-history/trip-history.component').then(
        (m) => m.TripHistoryComponent
      ),
      canActivate: [roleGuard],
      data: { roles: [3] },
  },
  {
    path: 'trip-detail',
    loadComponent: () =>
      import('./single-trip-detail/single-trip-detail.component').then(
        (m) => m.SingleTripDetailComponent
      ),
      canActivate: [roleGuard],
      data: { roles: [3] },
  },
  {
    path: 'edit-driver-details',
    loadComponent: () =>
      import('./edit-driver-profile/edit-driver-profile.component').then(
        (m) => m.EditDriverProfileComponent
      ),
      canActivate: [roleGuard],
      data: { roles: [3] },
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
