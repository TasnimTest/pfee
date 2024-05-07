import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployeeTraining } from '../Model/employee-training.model';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeTrainingService {


 private baseUrls = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) { }

  getAllUserTrainings(userId: number): Observable<EmployeeTraining[]> {
    return this.http.get<EmployeeTraining[]>(`${this.baseUrls}/${userId}/trainings`);
  }

  addUserTraining(userId: number,trainingId: number ): Observable<EmployeeTraining> {
    return this.http.post<EmployeeTraining>(`${this.baseUrls}/${userId}/training/${trainingId}`,null);
  }
  
  deleteUserTraining(userId: number, trainingId: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrls}/${userId}/training/${trainingId}`);
  }

  getUserTraining(userId: number, trainingId: number): Observable<EmployeeTraining[]> {
    return this.http.get<EmployeeTraining[]>(`${this.baseUrls}/${userId}/training/${trainingId}`);
  }

  updateUserTraining(userId: number, trainingId: number, updatedUserTraining: EmployeeTraining): Observable<EmployeeTraining> {
    return this.http.put<EmployeeTraining>(`${this.baseUrls}/${userId}/training/${trainingId}`, updatedUserTraining);
  }

  addNewTraining(userId: number, formData: FormData): Observable<EmployeeTraining> {
    return this.http.post<EmployeeTraining>(`${this.baseUrls}/${userId}/training`, formData);
  }


  getPublicTrainings(isPublic:Boolean): Observable<EmployeeTraining[]>{
    return this.http.get<EmployeeTraining[]>(`${this.baseUrls}/${isPublic}/public`)
  }

  registerForTraining(registrationData: any): Observable<any> {
    return this.http.post('http://localhost:8080/api/registerTraining', registrationData);
  }

  getTrainingsByStatus(status: string): Observable<EmployeeTraining[]> {
    return this.http.get<EmployeeTraining[]>(`${this.baseUrls}/${status}`);
  }

  
  updateTrainingStatus(id_employeetraining: number, status: string): Observable<any> {
    let params = new HttpParams().set('status', status);
    return this.http.put(`${this.baseUrls}/update-status/${id_employeetraining}`, null, { params });
}

}
