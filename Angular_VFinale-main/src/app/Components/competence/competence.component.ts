import { Component, Inject, Input, OnInit, inject } from '@angular/core';
import { EmployeeSkill } from '../../Model/employee-skill.module';
import {CommonModule} from "@angular/common";
import { EmployeeSkillService } from '../../Service/employee-skill.service';
import { AuthService } from '../../Service/auth.service';
import { UserService } from '../../Service/user.service';
import { User } from '../../Model/user.model';
import { FormsModule } from '@angular/forms';
import { Domaine,Niveau } from './competence-enum'; 



@Component({
  selector: 'app-competence',
  imports: [CommonModule,FormsModule],
  standalone: true,
  templateUrl: './competence.component.html',
  styleUrls: ['./competence.component.scss']

})
export class CompetenceComponent implements OnInit {


  userId!: number;
  skills: EmployeeSkill[] = []; 
  domaines: string[] = Object.values(Domaine);
  niveaux: string[] = Object.values(Niveau);
  newSkillName: string='';
  newSkillDomain: string='';
  newSkillNiveau: string='';

  constructor(private employeeSkillService: EmployeeSkillService,private authservice: AuthService,private userService:UserService) { }

  ngOnInit(): void {

    const userDetails = this.authservice.getUserDetails();

    if (userDetails && userDetails.username) {
      // Call the method to get user details by username
      this.userService.getUserByUsername(userDetails.username).subscribe(
        (user: User | null) => {
          if (user) {
            // Extract userId from user object
            this.userId = user.matricule;
            // Now you have the userId, you can fetch the skills
            this.getAllUserSkills();
          } else {
            console.error('User not found or error occurred while fetching user details.');
          }
        },
        (error) => {
          console.error('An error occurred while fetching user details:', error);
        }
      );
    } else {
      console.error('Logged-in username not found.');
    }
  }

  //Get USER_SKILLS Based on the USerID
  getAllUserSkills() {
    this.employeeSkillService.getAllUserSkills(this.userId).subscribe(
      (data: any[]) => {
        // Assuming the data structure is as you described
        this.skills = data.map(item => item.skill);
        console.log(this.skills); // Verify the structure of skills
      },
      (error) => {
        console.error('An error occurred while fetching user skills:', error);
      }
    );
  }

// ADD USER_SKILL
addUserSkill() {
  // Validate if new skill name, domain, and level are provided
  if (!this.newSkillName || !this.newSkillDomain || !this.newSkillNiveau) {
    console.error('Nom de la compétence, domaine et niveau requis.');
    return;
  }

  // Call addUserSkill method to add the new skill for the user
  this.employeeSkillService.addUserSkill(
    this.userId,
    this.newSkillName,
    this.newSkillDomain,
    this.newSkillNiveau // Pass the provided niveau to the backend
  ).subscribe(
    (skill: EmployeeSkill) => {
      console.log('Compétence utilisateur ajoutée avec succès:', skill);
      this.getAllUserSkills(); // Refresh the skills list after adding the new skill
    },
    (error: any) => {
      console.error('Une erreur s\'est produite lors de l\'ajout de la compétence utilisateur:', error);
    }
  );

  // Optionally, reset input fields after adding the skill
  this.newSkillName = '';
  this.newSkillDomain = '';
  this.newSkillNiveau = '';
}

// Method to add a new skill
addNewSkill() {
  if (!this.newSkillName || !this.newSkillDomain || !this.newSkillNiveau) {
    console.error('Nom de la compétence, domaine et niveau requis.');
    return;
  }

  // Call addUserSkill method to add the new skill for the user
  this.addUserSkill();
}



  // Delete USER_SKILL
  deleteUserSkill(skillId: number) {
    this.employeeSkillService.deleteUserSkill(this.userId, skillId).subscribe(
      (response: string) => {
        console.log(response);
        this.getAllUserSkills(); // Mettre à jour la liste des compétences après la suppression
      },
      (error: any) => {
        console.error('Une erreur s\'est produite lors de la suppression de la compétence utilisateur:', error);
      }
    );
  }
  

  // Mettre à jour une compétence utilisateur
  updateUserSkill( userId: number,skillId: number, updatedSkill: EmployeeSkill): void {
    this.employeeSkillService.updateUserSkill(userId,skillId,updatedSkill)
      .subscribe(
        (skill: EmployeeSkill) => {
          console.log('Employee skill updated successfully:', skill);
        },
        (error: any) => {
          console.error('An error occurred while updating employee skill:', error);
  
        }
      );
  }



}

