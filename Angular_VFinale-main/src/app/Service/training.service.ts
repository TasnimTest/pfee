import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Training } from '../Model/training.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  private apiUrl= 'http://localhost:8080/api/training';

  constructor(private http: HttpClient) { }

  getTrainings(): Observable<Training[]> {
    return this.http.get<Training[]>(this.apiUrl);
  }

  getTrainingByName(nom_formation : string): Observable<Training> {
    return this.http.get<Training>(`${this.apiUrl}/${nom_formation}`);
  }

  updateTraining(id: number, training: Training): Observable<Training> {
    return this.http.put<Training>(`${this.apiUrl}/${id}`, training);
  }

  deleteTraining(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
 
  addTraining(formData: FormData): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/addtraining`, formData);
  }

  

 


}

