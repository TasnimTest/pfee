import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeTraining } from '../../Model/employee-training.model';
import { EmployeeTrainingService } from '../../Service/employee-training.service';
import { AuthService } from '../../Service/auth.service';
import { UserService } from '../../Service/user.service';
import { Training } from '../../Model/training.model';


@Component({
  selector: 'app-catalogue-formation-admin',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './catalogue-formation-admin.component.html',
  styleUrl: './catalogue-formation-admin.component.scss'
})
export class CatalogueFormationAdminComponent {

  trainingss: EmployeeTraining[] = [];
  userId!: number;
  isPopupVisible = false;
  selectedTraining: Training | null = null; 
  registrationForm!: FormGroup;
 

  constructor(
   
    private employeeTrainingService: EmployeeTrainingService,
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder
    
  ) { }

  ngOnInit(): void {
    const userDetails = this.authService.getUserDetails();
    if (userDetails && userDetails.username) {
      this.userService.getUserByUsername(userDetails.username).subscribe(
        user => {
          if (user) {
            this.userId = user.matricule;
              this.loadPublicTrainings();
            }
          
        },
        error => {
          console.error('Error fetching user details:', error);
        }
      );
    } else {
      console.error('User details not found.');
    }
  
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    
    });
}


  loadPublicTrainings(): void {
    this.employeeTrainingService.getPublicTrainings(true).subscribe({
      next: (publicTrainings: any[]) => {
        this.trainingss = publicTrainings.map(training => {
          training.imageUrl = `http://localhost:8080${training['training'].imageUrl}`;
          return training;
        });
        console.log('Public trainings fetched successfully:', this.trainingss);
      },
      error: (error) => console.error('Error fetching public trainings:', error)
    });
  }

togglePopup(employeeTraining?: EmployeeTraining): void {
    if (employeeTraining) {
        this.selectedTraining = employeeTraining;  // Store the entire EmployeeTraining object
    } else {
        this.selectedTraining = null;
    }
    this.isPopupVisible = !this.isPopupVisible;
    console.log("Toggling popup with training data:", this.selectedTraining);
}


register(): void {
  if (this.registrationForm.valid && this.selectedTraining) {
    const registrationData = {
      nom_formation: this.selectedTraining.nom_formation,
      date: this.selectedTraining.date,
      username: this.registrationForm.value.username,
      email: this.registrationForm.value.email,
     

     
    };
  
    this.employeeTrainingService.registerForTraining(registrationData).subscribe({
      next: (response) => {
        console.log('Server response:', response);
        alert('Registration successful ,Please check your Email');
        window.location.reload();
      },
      error: (error) => {
        console.error('Error response:', error);
        alert('Registration successful ,Please check your Email');
        window.location.reload(); // Temporary handling to force a reload for testing
      }
    });
  } else {
    alert('Please ensure all form fields are filled correctly and a training is selected.');
  }
}}