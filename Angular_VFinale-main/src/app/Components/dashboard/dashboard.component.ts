import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartTypeRegistry, registerables } from 'chart.js';
import { EmployeeSkill } from '../../Model/employee-skill.module';
import { EmployeeSkillService } from '../../Service/employee-skill.service';
import { Domaine, Niveau } from '../competence/competence-enum';
import { UserService } from '../../Service/user.service';
import { AuthService } from '../../Service/auth.service';
import { User } from '../../Model/user.model';
import { ChartOptions } from 'chart.js/auto';
import { EmployeeTraining } from '../../Model/employee-training.model';
import { EmployeeTrainingService } from '../../Service/employee-training.service';
import { Avancement } from '../formation/formation-enum';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  skills: EmployeeSkill[] = [];
  trainings: EmployeeTraining[] = [];
  userId!: number;


  constructor(
    private skillService: EmployeeSkillService,
    private userService: UserService,
    private authService: AuthService,
    private employeeTrainingService : EmployeeTrainingService
  ) {}

  ngOnInit(): void {
    
    Chart.register(...registerables);
    this.fetchUserSkills();
    this.fetchUserTrainings()
  }

  // Fetch the user ID + fetch user skills related to this iD
  fetchUserSkills(): void {
    const userDetails = this.authService.getUserDetails(); //Fetch for the Username in the token of the logged in user
  

    if (userDetails && userDetails.username) {
      this.userService.getUserByUsername(userDetails.username).subscribe(   // load the user details based on his username
        (user: User | null) => {
          if (user) {
            this.userId = user.matricule;  // get the user ID from the loaded data 
            this.getAllUserSkills();  //fetch for  this user_skills
          } else {
            console.error('User NOT found');
          }
        },
        (error) => {
          console.error('Error while fetching user skills:', error);
        }
      );
    } else {
      console.error('Username not found');
    }
  }

  //fetch userskills based on his ID
  getAllUserSkills(): void {
    if (this.userId !== null) {
      this.skillService.getAllUserSkills(this.userId).subscribe(
        (data: any[]) => {
          this.skills = data.map(item => item.skill);  // stock the fetched data in the data array
          this.renderCharts();
        },
        (error) => {
          console.error(' error while fetching user skills', error);
        }
      );
    } else {
      console.error('User ID is null');
    }
  }

  renderCharts(): void {
 
    this.renderBarChart();

  }

  renderBarChart(): void {
    if (!this.userId) {
      console.error('User ID is null.');
      return;
    }

    this.skillService.getAllUserSkills(this.userId).subscribe(
      (userSkills: EmployeeSkill[]) => {
        if (!userSkills || userSkills.length === 0) {
          console.warn('No skills found for the user.');
          return;
        }

        const labels: string[] = [];
        const dataValues: number[] = [];
        const backgroundColor: string = this.generateRandomColor();

        userSkills.forEach((skill) => {
          const skillName = skill['skill'].nom_compétence;
          const skillLevel = skill['skill'].niveau as Niveau;
          labels.push(skillName);
          dataValues.push(Object.values(Niveau).indexOf(skillLevel) + 1);
        });

        const dataset = {
          label: 'Skill Level',
          data: dataValues,
          backgroundColor: backgroundColor,
        };

        const data = {
          labels: labels,
          datasets: [dataset],
        };

        const options: ChartOptions = {
          plugins: {
            title: {
              display: true,
              text: 'Employee Skills levels', 
              position: 'bottom', 
              font: {
                size: 18 
              }
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Skill Name'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Skill Level'
              },
              ticks: {
                callback: (value: string | number) => {
                  if (typeof value === 'number') {
                    return Object.values(Niveau)[value - 1];
                  }
                  return value;
                },
                stepSize: 1,
              },
            },
          },
        };
        

        this.createChart('barChart', 'bar', data,options);
      },
      (error) => {
        console.error('An error occurred while fetching user skills:', error);
      }
    );
  }

  generateRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  darkenColor(color: string): string {
    let num = parseInt(color.replace("#",""), 16);
    num -= 0x222222;
    let hex = num.toString(16);
    hex = hex.padStart(6, '0');
    return "#" + hex;
  }

  private chartInstances: { [key: string]: Chart } = {};

  createChart(canvasId: string, type: keyof ChartTypeRegistry, data: ChartConfiguration['data'], options?: ChartOptions): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas element not found:', canvasId);
      return;
    }
    const ctx = canvas.getContext('2d');
  
    if (!ctx) {
      console.error('Unable to get 2D context for canvas.');
      return;
    }

    // Destroy existing chart if it exists
    if (this.chartInstances[canvasId]) {
      this.chartInstances[canvasId].destroy();
    }

    // Create new chart and store its instance
    this.chartInstances[canvasId] = new Chart(ctx, {
      type: type,
      data: data,
      options: options 
    });
}

fetchUserTrainings(): void {
  const userDetails = this.authService.getUserDetails();
  if (userDetails && userDetails.username) {
    this.userService.getUserByUsername(userDetails.username).subscribe(
      (user) => {
        if (user) {
          this.userId = user.matricule;
          this.getAllUserTrainings();
        } else {
          console.error('User NOT found');
        }
      },
      (error) => console.error('Error while fetching user:', error)
    );
  } else {
    console.error('Username not found');
  }
}

getAllUserTrainings(): void {
  if (this.userId !== null) {
    this.employeeTrainingService.getAllUserTrainings(this.userId).subscribe(
      (data: any[]) => {
        this.trainings = data;
        this.renderTrainingAdvancementChart(); // Call chart rendering here after data is fetched
        console.log(this.trainings); // for debug
      },
      (error) => console.error('Error while fetching user trainings', error)
    );
  } else {
    console.error('User ID is null');
  }
}

renderTrainingAdvancementChart(): void {
  console.log("Processing trainings:", this.trainings); // Log the full list of trainings

  const avancementCounts = this.trainings.reduce((acc, training) => {
    console.log("Current training item:", training); // Log each training item to inspect structure
    const avancement = training['training'].avancement || 'Unknown'; // Accessing 'avancement' correctly
    console.log("Avancement found:", avancement); // Log the found or default 'avancement'
    acc[avancement] = (acc[avancement] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const labels = Object.keys(avancementCounts);
  const dataValues = Object.values(avancementCounts);

  const data = {
    labels: labels,
    datasets: [{
      label: 'Training Avancement',
      data: dataValues,
      backgroundColor: labels.map(() => this.generateRandomColor()), // Assuming this function exists
    }]
  };

  const options: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Employee Training Avancement'
      }
    }
  };

  this.createChart('trainingAvancementChart', 'doughnut', data, options);
}

}