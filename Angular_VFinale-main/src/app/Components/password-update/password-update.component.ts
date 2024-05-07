import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../Service/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Service/auth.service';

@Component({
  selector: 'app-password-update',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './password-update.component.html',
  styleUrl: './password-update.component.scss'
})
export class PasswordUpdateComponent {
  updateForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) 
  {
    this.updateForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
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