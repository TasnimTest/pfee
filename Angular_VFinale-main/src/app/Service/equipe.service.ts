import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EquipeService {

  private teamName: string = '';

  constructor() { }

  setTeamName(teamName: string): void {
    this.teamName = teamName;
  }

  getTeamName(): string {
    return this.teamName;
  }
}

