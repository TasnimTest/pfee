import { Component,  OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule,  ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeTrainingService } from '../../Service/employee-training.service';
import { AuthService } from '../../Service/auth.service';
import { UserService } from '../../Service/user.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Avancement,Niveau } from '../formation/formation-enum'; 



@Component({
  selector: 'app-ajouter-formation',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule,MatDatepickerModule,MatInputModule,MatNativeDateModule,MatIconModule],
  templateUrl: './ajouter-formation.component.html',
  styleUrl: './ajouter-formation.component.scss'
})


export class AjouterFormationComponent implements OnInit {
  trainings: any[] = [];
  addTrainingForm!: FormGroup;
  isPopupVisible: boolean = false;
  userId!: number;
  isAdmin: boolean = false;
  avancements: string[] = Object.values(Avancement);
  niveaux: string[] = Object.values(Niveau);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private employeeTrainingService: EmployeeTrainingService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.addTrainingForm = this.formBuilder.group({
      nom_formation: ['', Validators.required],
      date: ['', Validators.required],
      niveau: ['', Validators.required],
      avancement: ['', Validators.required],
      file: [null], 
      is_public: [true]
    });
  
    const userDetails = this.authService.getUserDetails();
    if (userDetails && userDetails.username) {
      this.userService.getUserByUsername(userDetails.username).subscribe(
        user => {
          if (user) {
            this.userId = user.matricule;
            this.isAdmin = user.role === 'Admin';
            if (this.isAdmin) {
              this.loadUserTrainings();
            } else {
              this.loadPublicTrainings();
            }
          } else {
            console.error('No user data available.');
          }
        },
        error => {
          console.error('Error fetching user details:', error);
        }
      );
    } else {
      console.error('User details not found.');
    }
  }

  loadUserTrainings(): void {
    this.employeeTrainingService.getAllUserTrainings(this.userId).subscribe({
      next: (trainings: any[]) => {
        this.trainings = trainings.map(training => {
          training.imageUrl = `http://localhost:8080${training['training'].imageUrl}`;
          return training;
        });
        console.log('User trainings fetched successfully:', this.trainings);
      },
      error: (error) => console.error('Error fetching user trainings:', error)
    });
  }

  loadPublicTrainings(): void {
    this.employeeTrainingService.getPublicTrainings(true).subscribe({
      next: (publicTrainings: any[]) => {
        this.trainings = publicTrainings.map(training => {
          training.imageUrl = `http://localhost:8080${training['training'].imageUrl}`;
          return training;
        });
        console.log('Public trainings fetched successfully:', this.trainings);
      },
      error: (error) => console.error('Error fetching public trainings:', error)
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.addTrainingForm.patchValue({
      file: file
    });
  }

  addTraining() {
    if (!this.addTrainingForm.valid) {
        console.error('Form is invalid.');
        return;
    }

    const formData = new FormData();
    const formValues = this.addTrainingForm.value;

    
    const formattedDate = (formValues.date instanceof Date) ? formValues.date.toISOString().slice(0, 10) : formValues.date;

    formData.append('nom_formation', formValues.nom_formation);
    formData.append('date', formattedDate);
    formData.append('niveau', formValues.niveau);
    formData.append('avancement', formValues.avancement);
    formData.append('isPublic', formValues.is_public ? 'true' : 'false');
  
   

    const file = this.addTrainingForm.get('file');
    if (file && file.value) {
        formData.append('file', file.value);
    } else {
        console.error('File control is not available or no file selected.');
        return;
    }

    this.employeeTrainingService.addNewTraining(this.userId, formData).subscribe({
        next: (response) => {
            console.log('Training added successfully:', response);
            this.trainings.push(response);
            this.addTrainingForm.reset();
            this.togglePopup();
            this.loadUserTrainings(); 
        },
        error: (error) => {
            console.error('Error adding training:', error);
        }
    });
}

  togglePopup() {
    this.isPopupVisible = !this.isPopupVisible;
  }

  deleteUserTraining(userId: number, trainingId: number) {
    console.log('Deleting training:', userId, trainingId);
    if (userId === undefined || trainingId === undefined) {
        return; 
    }
    this.employeeTrainingService.deleteUserTraining(userId, trainingId).subscribe({
        next: (response) => {
            console.log('Training deleted successfully:', response);
            this.trainings = this.trainings.filter(t => t.id !== trainingId);
            window.location.reload();
        },
        error: (error) => {
            console.error('Error deleting training:', error);
        }
    });
}


  
  
}


