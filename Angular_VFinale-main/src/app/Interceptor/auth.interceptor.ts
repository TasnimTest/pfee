
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../Service/auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const accessToken = this.authService.getAccessToken();

    if (accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && this.authService.getRefreshToken()) {
          // Token expired, attempt to refresh
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              // Retry the original request with the new access token
              req = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${this.authService.getAccessToken()}`
                }
              });
              return next.handle(req);
            }),
            catchError((refreshError: any) => {
              // If refresh fails, logout and redirect to login page
              this.authService.logout();
              return throwError(refreshError);
            })
          );
        } else {
          return throwError(error);
        }
      })
    );
  }
}