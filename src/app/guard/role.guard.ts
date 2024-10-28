import type { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || 'null');
  
  // Get expected roles from route data
  const expectedRoles = route.data['roles'] as Array<number>;

  // Check if the user is authenticated and has the required role
  if (userData && expectedRoles.includes(userData.role_id)) {
    return true;
  }

  router.navigate(['/logout']);
  return false;
};
