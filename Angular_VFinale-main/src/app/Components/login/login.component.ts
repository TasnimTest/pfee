import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { AuthService } from '../../Service/auth.service';




@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,NavbarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
 

  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Optionally, you can check if the user is already logged in and redirect them if needed
    if (this.authService.isLoggedIn()) {
      this.redirectBasedOnRole();
    }
  }

  login(event: Event) {
    event.preventDefault();
    this.authService.login({
      username: this.username,
      password: this.password,
    }).subscribe((userRole: string | null) => {
      window.location.reload(); // Recharge la page
      if (userRole !== null) {
        // Redirect based on the user's role
        this.redirectBasedOnRole();
      } else {
        // Handle case where user role is null (e.g., invalid token)
        console.error('Invalid token or role not found.');
        // Handle error or redirect to login page
      }
    });
  }

  private redirectBasedOnRole() {
    const userRole = this.authService.getUserRole();
    if (userRole === 'Admin') {
      this.router.navigate(['/home']);
    } else if (userRole === 'Employé') {
      this.router.navigate(['/home']);
    } else if (userRole === 'Manager') {
      this.router.navigate(['/home']);
    } else {
      // Handle unknown role or redirect to a default page
      console.error('Unknown role:', userRole);
      // Redirect to a default page
      this.router.navigate(['/']);
    }
  }
}