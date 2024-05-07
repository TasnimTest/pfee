import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrls = 'http://localhost:8080/user/employee';

  constructor(private http: HttpClient) { }
  
  updateNoteByMatricule(matricule: number, newNote: string, headers: HttpHeaders): Observable<any> {
    const url = `${this.baseUrls}/updateNote?matricule=${matricule}&newNote=${newNote}`;
    return this.http.put(url, null, { headers }); // Sending null as body since only query parameters are needed
  }

}
