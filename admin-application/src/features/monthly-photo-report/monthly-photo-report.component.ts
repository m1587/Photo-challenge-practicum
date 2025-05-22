import { HttpClient } from '@angular/common/http';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-monthly-photo-report',
  standalone: true,
  imports: [BaseChartDirective, MatCardModule,MatButtonModule,MatIconModule,MatDividerModule,CommonModule],
  templateUrl: './monthly-photo-report.component.html',
  styleUrl: './monthly-photo-report.component.css'
})
export class MonthlyPhotoReportComponent implements OnInit {
  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false, // כדי שהגרף לא יתפרס על כל המסך
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        ticks: {
          stepSize: 1,
          precision: 0,
        },
        beginAtZero: true,
      },
      x: {
        ticks: {
          autoSkip: false,
        }
      },

    }
  };

  public barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Photos per Month',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        data: [],
        label: 'Registrations per Month',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  constructor(private http: HttpClient) {
    // חובה לרשום את הרכיבים של chart.js כדי ש"bar" יעבוד
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadMonthlyReport();
    this.loadMonthlyRegistrationReport();
  }

  loadMonthlyReport() {
    this.http
      .get<{ [key: string]: number }>('https://photo-challenge-practicum-1.onrender.com/api/Challenge/monthly-photo-report')
      .subscribe((report) => {
        this.barChartData.labels = Object.keys(report);
        this.barChartData.datasets[0].data = Object.values(report);
      });
  }
  loadMonthlyRegistrationReport() {
    this.http
      .get<{ [key: string]: number }>('https://photo-challenge-practicum-1.onrender.com/api/Challenge/monthly-registration-report')
      .subscribe((report) => {
        const registrationCounts = Object.values(report);
        this.barChartData.datasets[1].data = registrationCounts;
      });
  }
}
