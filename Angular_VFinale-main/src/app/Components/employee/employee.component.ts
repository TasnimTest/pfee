import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../Service/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../Service/user.service';
import { User } from '../../Model/user.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})

export class EmployeeComponent implements OnInit {

  username: string = '';
  updatedUserData: any = {};
  user: User | null = null; // Placeholder for employee details
  isPopupVisible: boolean = false;
  updateForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.updateForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }
  ngOnInit(): void {
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
      const userDataToUpdate = { ...this.user }; // Clone the user object or create a new one with updated fields
      this.userService.updateUserByUsername(this.username, userDataToUpdate).subscribe(
        (updatedUser: User | null) => {
          if (updatedUser) {
            console.log('Employee details updated successfully:', updatedUser);
            this.user = updatedUser;
            window.location.reload(); // Recharge la page
          }
        } 
      ); 
    } 
  }

  openPopup() {
    this.isPopupVisible = true;
  }

  closePopup() {
    this.isPopupVisible = false;
  }


  onSubmit() {
    if (this.updateForm.valid) {
      const oldPassword = this.updateForm.value.oldPassword;
      const newPassword = this.updateForm.value.newPassword;
      const userDetails = this.authService.getUserDetails();
      if (userDetails) {
        const username = userDetails.username;
        this.userService.updatePassword(username, oldPassword, newPassword)
          .subscribe(
            () => {
              console.log('Password updated successfully');
              // Handle success, maybe redirect to another page or display a success message
              window.location.reload(); // Recharge la page
            },
            error => {
              console.error('Error updating password:', error);
              // Handle error, display an error message to the user
            }
          );
      } else {
        console.error('User details not available');
      }
    }
  }

}