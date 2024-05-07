import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../Service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const roles = next.data['roles'];

    const userRole = this.authService.getUserRole();
    if (userRole && (typeof roles === 'string' ? userRole === roles : roles.includes(userRole))) {
      return true;
    } else {
      console.error('User does not have required role, denying access');
      this.router.navigate(['/']); // Redirect to home or login page
      return false;
    }
  }
}
