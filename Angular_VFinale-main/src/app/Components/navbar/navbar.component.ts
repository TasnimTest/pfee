import { Component, inject } from '@angular/core';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Service/auth.service';
import { HttpClientModule,HttpClientXsrfModule } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,HttpClientModule,HttpClientXsrfModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
 authService=inject(AuthService);

  router=inject(Router);

  getUserDetails(){
    return this.authService.getUserDetails();
  }

  isLoggedIn(){
    return this.authService.isLoggedIn();
  }

  
  logout():void{
    this.authService.logout();
  }

  userRole: string = ''; // Initialisez userRole avec une chaîne vide par défaut

  constructor(private authservice: AuthService) {}

  ngOnInit(): void {
    // Récupérer le rôle de l'utilisateur à partir du service AuthService
    const role = this.authservice.getUserRole();
    if (role !== null) {
      this.userRole = role; // Affectez la valeur de role uniquement si elle n'est pas null
    }
  }
  
  sidebarVisible = false; // Variable pour contrôler la visibilité du sidebar

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible; // Inverse la valeur de la variable pour masquer/afficher le sidebar
  }
}
