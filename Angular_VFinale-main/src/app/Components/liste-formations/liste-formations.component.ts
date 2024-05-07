import { Component, OnInit } from '@angular/core';
import { EmployeeTraining } from '../../Model/employee-training.model';
import { EmployeeTrainingService } from '../../Service/employee-training.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Service/auth.service';
import { UserService } from '../../Service/user.service';
import { catchError, filter, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-liste-formations',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './liste-formations.component.html',
  styleUrl: './liste-formations.component.scss'
})
export class ListeFormationsComponent implements OnInit {

  pendingTrainings: EmployeeTraining[] = [];
  isVisible: boolean = false;
  approvedTrainings: EmployeeTraining[] = [];
  declinedTrainings: EmployeeTraining[] = [];

  constructor(private employeeTrainingService: EmployeeTrainingService,private authService : AuthService, private userService : UserService) { }

  ngOnInit(): void {
    this.loadPendingRegistrations();
  }


  loadPendingRegistrations(): void {
    const userDetails = this.authService.getUserDetails();
    if (!userDetails) {
      console.error('User details not found or user is not logged in.');
      this.pendingTrainings = [];
      return;
    }

    console.log("Logged-in User Details:", userDetails);

    const currentUserUsername = userDetails.username;

    this.employeeTrainingService.getTrainingsByStatus('En_attente').subscribe({
      next: (trainings: any[]) => {
        console.log("Received Trainings:", trainings);
        
        // Log the entire structure of the first training object to see its structure
        if (trainings.length > 0) {
          console.log("First Training Object Structure:", trainings[0]);
        }

        // Correct the path based on the first training object inspection
        this.pendingTrainings = trainings.filter(training => {
          const trainingUsername = training.employee ? training.employee.username : undefined;
          console.log(`Training username: ${trainingUsername}, Current user: ${currentUserUsername}, Filter out: ${trainingUsername === currentUserUsername}`);
          return trainingUsername !== currentUserUsername;
        });

        console.log('Filtered Trainings:', this.pendingTrainings);
      },
      error: (err) => {
        console.error('Error loading trainings:', err);
        this.pendingTrainings = [];
      }
    });
  }





  updateTrainingStatus(id_employeetraining: number, newStatus: string): void {
    this.employeeTrainingService.updateTrainingStatus(id_employeetraining, newStatus).subscribe({
      next: () => {
        alert(`Training status updated to ${newStatus}`);
        window.location.reload();
      },
     
    });
  }

  loadRegistrations(): void {
    this.employeeTrainingService.getTrainingsByStatus('Approuvé').subscribe(trainings => {
      this.approvedTrainings = trainings;
    });
    this.employeeTrainingService.getTrainingsByStatus('Rejeté').subscribe(trainings => {
      this.declinedTrainings = trainings;
    });
  }

  togglePopup(): void {
    this.isVisible = !this.isVisible;
    if (this.isVisible) {
      this.loadRegistrations();
    }
  }

}
