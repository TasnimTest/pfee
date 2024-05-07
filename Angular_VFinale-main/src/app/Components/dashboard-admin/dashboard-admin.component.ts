
import { Component, OnInit } from '@angular/core';
import { BubbleDataPoint, Chart, ChartConfiguration, ChartTypeRegistry, ScatterDataPoint, TooltipItem, registerables } from 'chart.js';
import { EmployeeSkill } from '../../Model/employee-skill.module';
import { EmployeeSkillService } from '../../Service/employee-skill.service';
import { Domaine, Niveau } from '../competence/competence-enum';
import { ChartOptions } from 'chart.js/auto';
import { UserService } from '../../Service/user.service';
import { User } from '../../Model/user.model';


@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent implements OnInit {
  skills: EmployeeSkill[] = [];

  constructor(private skillService: EmployeeSkillService,private userService:UserService) {}

  ngOnInit(): void {
    Chart.register(...registerables);
  
    this.fetchAndDisplayData();
    this.fetchAndDisplayEmployeeData();
    
  }


  private fetchAndDisplayEmployeeData(): void {
    this.userService.getAllEmployees().subscribe({
      next: (employees) => {
        this.renderPieChart(employees);
      },
      error: (err) => console.error('Failed to fetch employees', err)
    });
  }

  renderPieChart(employees: User[]): void {
    const gradeCounts = employees.reduce((acc, emp) => {
      acc[emp.grade] = (acc[emp.grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
    const labels = Object.keys(gradeCounts);
    const dataValues = Object.values(gradeCounts);
  
    // Calculate total number of employees to find percentages
    const totalEmployees = employees.length;
    const percentageData = dataValues.map(count => (count / totalEmployees * 100).toFixed(2)); // keep two decimal points
  
    const data = {
      labels: labels,
      datasets: [{
        label: 'Grade Distribution',
        data: dataValues, // Alternatively use percentageData to display percentages
        backgroundColor: labels.map(() => this.generateRandomColor()),
      
      }]
    };
  
    const options: ChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              let label = data.labels[tooltipItem.dataIndex];
              let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.dataIndex];
              let percentage = percentageData[tooltipItem.dataIndex];
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        },
        title: {
          display: true,
          text: 'Employee Distribution by Grade'
        }
      }
    };
  
    // Use the existing createChart method
    this.createChart('pieChart', 'pie', data, options);
  }
 
  
 
 
 
  generateRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  darkenColor(color: string): string {
    let num = parseInt(color.replace("#", ""), 16);
    num -= 0x222222;
    return "#" + num.toString(16).padStart(6, '0');
  }

  createChart(canvasId: string, type: keyof ChartTypeRegistry, data: ChartConfiguration['data'], options?: ChartOptions): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Unable to get 2D context for canvas.');
      return;
    }

    new Chart(ctx, {
      type,
      data,
      options
    });
  }

  
    private fetchAndDisplayData(): void {
      this.userService.getAllEmployees().subscribe({
        next: (employees) => {
          this.renderDoughnutChart(employees);
        },
        error: (err) => console.error('Failed to fetch employees', err)
      });
    }


    renderDoughnutChart(employees: User[]): void {
      const departmentCounts = employees.reduce((acc, emp) => {
        acc[emp.département] = (acc[emp.département] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
      const labels = Object.keys(departmentCounts);
      const dataValues = Object.values(departmentCounts);
    
      // Calculate total number of employees to find percentages
      const totalEmployees = employees.length;
      const percentageData = dataValues.map(count => (count / totalEmployees * 100).toFixed(2)); // keep two decimal points
    
      const data = {
        labels: labels,
        datasets: [{
          label: 'Department Distribution',
          data: dataValues, // You can switch to percentageData if you want to plot percentages instead
          backgroundColor: labels.map(() => this.generateRandomColor())
        }]
      };
    
      const options: ChartOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                let label = data.labels[tooltipItem.dataIndex];
                let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.dataIndex];
                let percentage = percentageData[tooltipItem.dataIndex];
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          },
          title: {
            display: true,
            text: 'Employee Distribution by Department'
          }
        }
      };
    
      // Use the existing createChart method
      this.createChart('doughnutChart', 'doughnut', data, options);
    }
  }