import { Component, OnInit } from '@angular/core';
import { User } from '../../Model/user.model';
import { AuthService } from '../../Service/auth.service';
import { UserService } from '../../Service/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../Service/data.service';
import { EmployeeSkillService } from '../../Service/employee-skill.service';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { EquipeService } from '../../Service/equipe.service';

@Component({
  selector: 'app-membre-equipe',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './membre-equipe.component.html',
  styleUrl: './membre-equipe.component.scss'
})
export class MembreEquipeComponent implements OnInit {
  id: any;
  employees: User[] = [];
  skillMap: { [key: number]: any[] } = {};
  employeeUsername: string = '';
  username: string = '';
  updatedUserData: any = {};
  user: User | null = null; // Placeholder for employee details

  constructor(
    private userService: UserService, 
    private authService: AuthService, 
    private router: Router,
    private dataService: DataService, 
    private employeeSkill: EmployeeSkillService,
  private equipeService : EquipeService) {}

  ngOnInit() {
    
    this.loadAllEmployeesByRoleEmployee();
    this.fetchEmployeeDetails();
    
    const allowedRoles = ['Manager']; // Define roles allowed to access this component
  
 
     // Check if the user is authenticated and their role is allowed
     if (!this.authService.isLoggedIn() || !allowedRoles) {
       this.router.navigate(['/']);
     }

     const userDetails = this.authService.getUserDetails();

     if (userDetails) {
       this.username = userDetails.username;
       this.fetchEmployeeDetails();
     } else {
       console.error('User details not available.');
     }
  }


  updateNoteInDatabase(matricule: number, newNote:string): void {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (!token) {
      console.error('Token not found in local storage.');
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    this.dataService.updateNoteByMatricule(matricule, newNote, headers)
      .subscribe(
        response => {
          alert("successfully updated note");
        },
        error => {
          alert("successfully updated note");
        }
      );
  }

  
  fetchEmployeeDetails() {
    if (!this.username) {
      console.error('Username is not defined.');
      return;
    }
    this.userService.getUserByUsername(this.username).subscribe(
      (data: User | null) => {
        if (data) {
          this.user = data;
        } else {
          console.error('User not found or an error occurred.');
        }
      },
      (error) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }
  
  updateUserByUsername() {
    if (this.user !== null && this.user !== undefined) {
      const userDataToUpdate = { ...this.user }; 
      this.userService.updateUserByUsername(this.username, userDataToUpdate).subscribe(
        (updatedUser: User | null) => {
          if (updatedUser) {
            console.log('Employee details updated successfully:', updatedUser);
            this.user = updatedUser;
          }
        } 
      ); 
    } 
  }


  
  loadAllEmployeesByRoleEmployee() {
    this.userService.getAllEmployeesByRoleEmployee().subscribe(
      (employees: User[]) => {
        this.employees = employees;
        
      },
      (error) => {
        console.error('Error fetching employees by role employee:', error);
      }
    );
  }



 
}
