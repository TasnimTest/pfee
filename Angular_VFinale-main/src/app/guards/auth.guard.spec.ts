import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import {authGuard } from './auth.guard';
import { AuthService } from '../Service/auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';

describe('AuthGuard', () => { 
 let guard = inject(authGuard);
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [authGuard, AuthService]
    });
    guard = TestBed.inject(authGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation when user is logged in', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    const canActivate = guard.canActivate(mockActivatedRouteSnapshot(), mockRouterStateSnapshot());
    expect(canActivate).toBe(true);
  });

  it('should prevent activation when user is not logged in', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(false);
    spyOn(router, 'navigate');
    const canActivate = guard.canActivate(mockActivatedRouteSnapshot(), mockRouterStateSnapshot());
    expect(canActivate).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});

function mockActivatedRouteSnapshot(): ActivatedRouteSnapshot {
  return {} as ActivatedRouteSnapshot;
}

function mockRouterStateSnapshot(): RouterStateSnapshot {
  return {} as RouterStateSnapshot;
}
