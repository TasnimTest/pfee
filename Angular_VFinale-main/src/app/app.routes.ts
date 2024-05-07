import { Routes } from '@angular/router';
import {authGuard } from './guards/auth.guard';
import { HomeComponent } from './Components/home/home.component'; 
import { LoginComponent } from './Components/login/login.component'; 
import { EmployeeComponent } from './Components/employee/employee.component'; 
import { RoleGuard } from './guards/role.guard';
import { AdminComponent } from './Components/admin/admin.component';
import { ManagerComponent } from './Components/manager/manager.component';
import { PasswordUpdateComponent } from './Components/password-update/password-update.component';
import { CompetenceComponent } from './Components/competence/competence.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { FormationComponent } from './Components/formation/formation.component';
import { AjouterFormationComponent } from './Components/ajouter-formation/ajouter-formation.component';
import { CatalogueFormationComponent } from './Components/catalogue-formation/catalogue-formation.component';
import { ListEmployeesComponent } from './Components/list-employees/list-employees.component';
import { DashboardAdminComponent } from './Components/dashboard-admin/dashboard-admin.component';
import { ListeFormationsComponent } from './Components/liste-formations/liste-formations.component';
import { CatalogueFormationAdminComponent } from './Components/catalogue-formation-admin/catalogue-formation-admin.component';
import { DashboardEquipeComponent } from './Components/dashboard-equipe/dashboard-equipe.component';
import { MembreEquipeComponent } from './Components/membre-equipe/membre-equipe.component';

export const routes: Routes = [
  { 
    path: '', 
    component: LoginComponent 
  },
  { 
    path: 'home', 
    component: HomeComponent, 
    canActivate: [authGuard] 
  }, 
  { 
    path: 'profile/password-update', 
    component: PasswordUpdateComponent
  }, // Route pour la page "Password Update"
  { 
    path: 'profile/update', 
    component: EmployeeComponent
  },
  { 
    path: 'employee', 
    component: EmployeeComponent, 
    canActivate: [authGuard, RoleGuard], 
    data: { 
      roles: ['Employé'] 
    } 
  },
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate: [authGuard, RoleGuard], 
    data: { 
      roles: ['Admin'] 
    } 
  },
  { 
    path: 'manager', 
    component: ManagerComponent, 
    canActivate: [authGuard, RoleGuard], 
    data: { 
      roles: ['Manager'] 
    } 
  },
  {
    path: 'employee/:username', 
    component: EmployeeComponent, 
    canActivate: [authGuard]
  },
  {
    path: 'employee/:username/update', 
    component: EmployeeComponent, 
    canActivate: [authGuard]
  },
  { 
    path: 'password-update', 
    component:PasswordUpdateComponent
  },
  {
    path:'competence',
    component: CompetenceComponent
  },

  {
    path:'dashboard',
    component: DashboardComponent
  },

  {
    path:'formation',
    component: FormationComponent
  },

  {
    path:'Ajouterformation',
    component:AjouterFormationComponent
  },
  
  {
    path:'Catalogueformation',
    component:CatalogueFormationComponent
  },

  {
    path:'listeEmployés',
    component:ListEmployeesComponent
  },

  {
    path:'DashboardAdmin',
    component:DashboardAdminComponent
  },

  {
    path:'listeFormations',
    component:ListeFormationsComponent
  },


  {
    path:'CatalogueAdmin',
    component:CatalogueFormationAdminComponent
  },


  
  {
    path:'DashboardEquipe',
    component:DashboardEquipeComponent
  },


  {
    path:'membre_equipe',
    component:MembreEquipeComponent
  },

  {
    path:'equipe',
    component: MembreEquipeComponent
  },

  
 
  
];