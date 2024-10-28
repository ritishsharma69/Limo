import { inject } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';

export const loginGaurdGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('userData');
  const role = localStorage.getItem('role');

  if (token && userData && role) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
