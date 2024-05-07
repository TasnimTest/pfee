import { Component, OnInit } from '@angular/core';
import { EmployeeTraining } from '../../Model/employee-training.model';
import { Avancement, Niveau } from './formation-enum';
import { EmployeeTrainingService } from '../../Service/employee-training.service';
import { AuthService } from '../../Service/auth.service';
import { UserService } from '../../Service/user.service';
import { User } from '../../Model/user.model';
import {CommonModule} from "@angular/common";
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-formation',
  standalone: true,
  imports: [CommonModule,FormsModule,MatDatepickerModule,MatInputModule,MatNativeDateModule,MatIconModule],
  templateUrl: './formation.component.html',
  styleUrl: './formation.component.scss'
})
export class FormationComponent implements OnInit {

  userId!: number;
  trainings: EmployeeTraining[] = []; 
  avancements: string[] = Object.values(Avancement);
  niveaux: string[] = Object.values(Niveau);

  constructor(private employeeTrainingService: EmployeeTrainingService,private authservice: AuthService,private userService:UserService) { }

  ngOnInit(): void {

    const userDetails = this.authservice.getUserDetails();

    if (userDetails && userDetails.username) {
      // Call the method to get user details by username
      this.userService.getUserByUsername(userDetails.username).subscribe(
        (user: User | null) => {
          if (user) {
            // Extract userId from user object
            this.userId = user.matricule;
            // Now you have the userId, you can fetch the Trainings
                  
           this.getAllUserTrainings();
           
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


  //Get USER_Trainings Based on the USerID
  getAllUserTrainings() {
    this.employeeTrainingService.getAllUserTrainings(this.userId).subscribe(
        (data: any[]) => {
            // Assuming each item in 'data' represents a training object that includes a status property.
            this.trainings = data.filter(item => item.status === 'Approuvé').map(item => item.training);
            console.log(this.trainings); // Verify the structure of trainings
        },
        (error) => {
            console.error('An error occurred while fetching user trainings:', error);
        }
    );
}


  // Delete USER_Training
  deleteUserTraining(trainingId: number) {
    this.employeeTrainingService.deleteUserTraining(this.userId, trainingId).subscribe(
      (response: string) => {
        console.log(response);
        this.getAllUserTrainings(); // Mettre à jour la liste des formations  après la suppression
      },
      (error: any) => {
        console.error('Une erreur s\'est produite lors de la suppression de la formation :', error);
      }
    );
  }
  

  // Update Employee_Training
  updateUserTraining( userId: number,trainingId: number, updatedTraining: EmployeeTraining): void {
    this.employeeTrainingService.updateUserTraining(userId,trainingId,updatedTraining)
      .subscribe(
        (training: EmployeeTraining) => {
          console.log('Employee Training updated successfully:', training);
        },
        (error: any) => {
          console.error('An error occurred while updating employee training:', error);
  
        }
      );
  }



 

}
