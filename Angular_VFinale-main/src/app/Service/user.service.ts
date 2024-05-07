import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { User } from '../Model/user.model';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/user/employee';

  constructor(private http: HttpClient,private authService : AuthService) {}

  // Get token headers
  private getTokenHeaders(): HttpHeaders {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
      return new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json');
    } else {
      console.error('Token not found in local storage.');
      return new HttpHeaders().set('Content-Type', 'application/json');
    }
  }

  // Get user by username
  getUserByUsername(username: string): Observable<User | null> {
    const headers = this.getTokenHeaders();
    return this.http.get<User>(`${this.baseUrl}/${username}`,{ headers }).pipe(
      catchError(error => {
        console.error('Error fetching user details:', error);
        return of(null);
      })
    );
  } 

  // Update user by username
  updateUserByUsername(username: string, userData: any): Observable<User | null> {
    const headers = this.getTokenHeaders();
    return this.http.put<User>(`${this.baseUrl}/${username}/update`, userData, { headers });
  }


  updatePassword(username: string, oldPassword: string, newPassword: string): Observable<any> {
    const headers = this.getTokenHeaders();
    return this.http.put(`${this.baseUrl}/${username}/password`, { oldPassword, newPassword }, { headers });
  }

  getAllEmployees(): Observable<User[]> {
    return this.http.get<User[]>(`http://localhost:8080/employees`);
  }

  register(employee: User): Observable<AuthenticatorResponse> {
    return this.http.post<AuthenticatorResponse>(`http://localhost:8080/register`, employee);
  }


  // Méthode pour récupérer tous les employés de rôle "Employé"
  getAllEmployeesByRoleEmployee( ): Observable<User[]> {
    return this.http.get<User[]>(`http://localhost:8080/employees`).pipe(
    map(employees => employees.filter(employee => employee.role === 'Employé')) 
    );
  }

  // Méthode pour récupérer tous les employés de nom equipe
  getEmployeesByTeam(team: string): Observable<User[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.authService.getAccessToken() // Assuming you have a method to retrieve the stored token
      })
    };
    return this.http.get<User[]>(`${this.baseUrl}/${team}/equipe`, httpOptions);
  }

    // Méthode pour récupérer tous les employés de type "Employé" et appartenant à une équipe spécifique
    getEmployeesByRoleAndTeam(team: string): Observable<User[]> {
      return this.getAllEmployeesByRoleEmployee().pipe(
        map(employees => employees.filter(employee => employee.nom_equipe === team))
      );
    }



}
