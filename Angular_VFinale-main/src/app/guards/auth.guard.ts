import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  let authService = inject(AuthService); // we are injecting  the authservice to check if the user is logged in 
  let routerService = inject(Router);
  if(!authService.isLoggedIn()){
      routerService.navigate(['/']);
      return false;
  }
  return true;
};
