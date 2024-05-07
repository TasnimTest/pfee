import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeSkill } from '../Model/employee-skill.module';

@Injectable({
  providedIn: 'root'
})
export class EmployeeSkillService {
  private baseUrls = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) { }

  getAllUserSkills(userId: number): Observable<EmployeeSkill[]> {
    return this.http.get<EmployeeSkill[]>(`${this.baseUrls}/${userId}/skills`);
  }

  addUserSkill(userId: number, nom_compétence: string, domaine: string, niveau: string): Observable<EmployeeSkill> {
    const body = { domaine, niveau };
    return this.http.post<EmployeeSkill>(`${this.baseUrls}/${userId}/skill/${nom_compétence}`, body);
  }

  deleteUserSkill(userId: number, skillId: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrls}/${userId}/skill/${skillId}`);
  }

  getUserSkill(userId: number, skillId: number): Observable<EmployeeSkill[]> {
    return this.http.get<EmployeeSkill[]>(`${this.baseUrls}/${userId}/skill/${skillId}`);
  }

  updateUserSkill(userId: number, skillId: number, updatedUserSkill: EmployeeSkill): Observable<EmployeeSkill> {
    return this.http.put<EmployeeSkill>(`${this.baseUrls}/${userId}/skill/${skillId}`, updatedUserSkill);
  }

  getSkills(): Observable<EmployeeSkill[]> {
    return this.http.get<EmployeeSkill[]>('http://localhost:8080/api/skill');
  }
}
