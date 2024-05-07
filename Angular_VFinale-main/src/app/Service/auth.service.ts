import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userService: any;
  hasAnyRole(allowedRoles: string[]) {
    throw new Error('Method not implemented.');
  }

  private readonly JWT_Token ='JWT_Token';

  private loggedUser?: string;

  private isAuthenticatedSubject = new BehaviorSubject<Boolean>(false);

  private readonly ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
  private readonly REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';

 


  constructor(private http: HttpClient, private router: Router) { }

  login(user: { username: string, password: string }): Observable<any> {
    return this.http.post<any>('http://localhost:8080/login', user)
      .pipe(
        tap((response: any) => {
          if (response.accessToken && response.refreshToken) {
            // Securely store the token
            this.storeJwtToken(response.accessToken, response.refreshToken);
            this.doLoginUser(user.username);
            this.redirectBasedOnUserRole(); // Redirect after login // Pass roles to doLoginUser
          } else {
            // Handle invalid login scenario
            throw new Error('Invalid login credentials');
          }
        }),
      );
  }

  redirectBasedOnUserRole() {
    const userRole = this.getUserRole();
    let redirectUrl = '/';
    switch (userRole) {
      case 'Admin':
        redirectUrl = '/admin';
        break;
      case 'Employé':
        redirectUrl = '/employee';
        break;
      case 'Manager':
        redirectUrl = '/manager';
        break;
    }
    this.router.navigate([redirectUrl]);
  }

  
  private doLoginUser(username: string) {
    this.loggedUser = username;
    this.isAuthenticatedSubject.next(true);
    
  }

  private storeJwtToken(accessToken: string, refreshToken: string): void {
    localStorage.setItem('ACCESS_TOKEN', accessToken);
    localStorage.setItem('REFRESH_TOKEN', refreshToken);
  }
  

  getRefreshToken(): string | null {
    return localStorage.getItem('REFRESH_TOKEN');
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError('Refresh token not found');
    }
    
    return this.http.post<any>('http://localhost:8080/refresh', { 
      refresh_token: refreshToken 
    })
      .pipe(
        tap((response: any) => {
          if (response.access_token) {
            localStorage.setItem('ACCESS_TOKEN', response.access_token);
          } else {
            throw new Error('Unable to refresh token');
          }
        })
      );
  }
  



  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.router.navigate(['/']); // Assuming you have a login route
  }

  getUserRole(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
  
    const decodedToken: any = jwtDecode(token);
    const role = decodedToken.role;
  
    // Handle null role
    if (role === null) {
      console.warn('User role is null in JWT token');
      return 'defaultRole'; // Provide a default role or handle it as needed
    }
  
    return role;
  }

   getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }


  getCurrentAuthUser(): string {
    const userRole = this.getUserRole();
  
    // Modify the URL based on the user's role or any other conditions
    let url = '';
    switch (userRole) {
      case "Admin":
        url = 'http://localhost:8080/user/admin';
        break;
      case "Employé":
        url = 'http://localhost:8080/user/employee';
        break;
      case "Manager":
        url = 'http://localhost:8080/user/manager';
        break;
      default:
        url = '/'; // Default URL or route for unknown roles
        break;
    }
  
    return url;
  }
  

  isLoggedIn(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired(token);
  }
  
  

  isTokenExpired(token: string): boolean {
    const decoded = jwtDecode(token);
    return decoded.exp ? Date.now() >= decoded.exp * 1000 : false;
  }

  getUserDetails(): { username: string, role: string } | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const decodedToken: any = jwtDecode(token);
      const username = decodedToken.sub;
      const role = decodedToken.role;

      if (!username || !role) {
        throw new Error('Username or role not found in token');
      }

      return { username, role };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };


  }


 







