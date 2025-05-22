// import { HttpClient } from '@angular/common/http';
// import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
// import { Component, OnInit } from '@angular/core';
// import { BaseChartDirective } from 'ng2-charts';
// import { MatCardModule } from '@angular/material/card';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { CommonModule } from '@angular/common';
// import { MatDividerModule } from '@angular/material/divider';
// @Component({
//   selector: 'app-monthly-photo-report',
//   standalone: true,
//   imports: [BaseChartDirective, MatCardModule,MatButtonModule,MatIconModule,MatDividerModule,CommonModule],
//   templateUrl: './monthly-photo-report.component.html',
//   styleUrl: './monthly-photo-report.component.css'
// })
// export class MonthlyPhotoReportComponent implements OnInit {
//   public barChartType: ChartType = 'bar';
//   public barChartOptions: ChartConfiguration['options'] = {
//     responsive: true,
//     maintainAspectRatio: false, // כדי שהגרף לא יתפרס על כל המסך
//     plugins: {
//       legend: {
//         display: true,
//       },
//       tooltip: {
//         enabled: true,
//       },
//     },
//     scales: {
//       y: {
//         ticks: {
//           stepSize: 1,
//           precision: 0,
//         },
//         beginAtZero: true,
//       },
//       x: {
//         ticks: {
//           autoSkip: false,
//         }
//       },

//     }
//   };

//   public barChartData: ChartConfiguration['data'] = {
//     labels: [],
//     datasets: [
//       {
//         data: [],
//         label: 'Photos per Month',
//         backgroundColor: 'rgba(75, 192, 192, 0.5)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//       },
//       {
//         data: [],
//         label: 'Registrations per Month',
//         backgroundColor: 'rgba(255, 99, 132, 0.5)',
//         borderColor: 'rgba(255, 99, 132, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   constructor(private http: HttpClient) {
//     // חובה לרשום את הרכיבים של chart.js כדי ש"bar" יעבוד
//     Chart.register(...registerables);
//   }

//   ngOnInit(): void {
//     this.loadMonthlyReport();
//     this.loadMonthlyRegistrationReport();
//   }

//   loadMonthlyReport() {
//     this.http
//       .get<{ [key: string]: number }>('https://photo-challenge-practicum-1.onrender.com/api/Challenge/monthly-photo-report')
//       .subscribe((report) => {
//         this.barChartData.labels = Object.keys(report);
//         this.barChartData.datasets[0].data = Object.values(report);
//       });
//   }
//   loadMonthlyRegistrationReport() {
//     this.http
//       .get<{ [key: string]: number }>('https://photo-challenge-practicum-1.onrender.com/api/Challenge/monthly-registration-report')
//       .subscribe((report) => {
//         const registrationCounts = Object.values(report);
//         this.barChartData.datasets[1].data = registrationCounts;
//       });
//   }
// }
import { HttpClient } from "@angular/common/http"
import { Chart, type ChartConfiguration, type ChartType, registerables } from "chart.js"
import { Component, type OnInit, ViewChild, type ElementRef, type AfterViewInit } from "@angular/core"
import { BaseChartDirective } from "ng2-charts"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { CommonModule } from "@angular/common"
import { MatDividerModule } from "@angular/material/divider"
import { MatMenuModule } from "@angular/material/menu"
import { MatButtonToggleModule } from "@angular/material/button-toggle"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatTooltipModule } from "@angular/material/tooltip"
import { FormsModule } from "@angular/forms"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

@Component({
  selector: "app-monthly-photo-report",
  standalone: true,
  imports: [
    BaseChartDirective,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    CommonModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    FormsModule,
  ],
  templateUrl: "./monthly-photo-report.component.html",
  styleUrl: "./monthly-photo-report.component.css",
})
export class MonthlyPhotoReportComponent implements OnInit, AfterViewInit {
  @ViewChild("chartContainer") chartContainer!: ElementRef
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective

  public barChartType: ChartType = "bar"
  public isLoading = true
  public selectedTimeRange = "12"
  public currentFontFamily = "Inter"
  public currentFontSize = "medium"

  // Chart themes
  private chartThemes = {
    default: {
      photos: {
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
      registrations: {
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
      },
    },
    pastel: {
      photos: {
        backgroundColor: "rgba(142, 202, 230, 0.5)",
        borderColor: "rgba(142, 202, 230, 1)",
      },
      registrations: {
        backgroundColor: "rgba(255, 183, 178, 0.5)",
        borderColor: "rgba(255, 183, 178, 1)",
      },
    },
    vibrant: {
      photos: {
        backgroundColor: "rgba(106, 90, 205, 0.5)",
        borderColor: "rgba(106, 90, 205, 1)",
      },
      registrations: {
        backgroundColor: "rgba(255, 165, 0, 0.5)",
        borderColor: "rgba(255, 165, 0, 1)",
      },
    },
    monochrome: {
      photos: {
        backgroundColor: "rgba(70, 70, 70, 0.5)",
        borderColor: "rgba(70, 70, 70, 1)",
      },
      registrations: {
        backgroundColor: "rgba(130, 130, 130, 0.5)",
        borderColor: "rgba(130, 130, 130, 1)",
      },
    },
  }

  public barChartOptions: ChartConfiguration["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            family: this.currentFontFamily,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: {
          family: this.currentFontFamily,
        },
        bodyFont: {
          family: this.currentFontFamily,
        },
        padding: 10,
        cornerRadius: 4,
      },
      title: {
        display: false,
        text: "Monthly Statistics",
        font: {
          family: this.currentFontFamily,
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        ticks: {
          stepSize: 1,
          precision: 0,
          font: {
            family: this.currentFontFamily,
          },
        },
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        ticks: {
          autoSkip: false,
          font: {
            family: this.currentFontFamily,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  }

  public barChartData: ChartConfiguration["data"] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: "Photos per Month",
        backgroundColor: this.chartThemes.default.photos.backgroundColor,
        borderColor: this.chartThemes.default.photos.borderColor,
        borderWidth: 1,
      },
      {
        data: [],
        label: "Registrations per Month",
        backgroundColor: this.chartThemes.default.registrations.backgroundColor,
        borderColor: this.chartThemes.default.registrations.borderColor,
        borderWidth: 1,
      },
    ],
  }

  // Store raw data for filtering
  private rawPhotoData: { [key: string]: number } = {}
  private rawRegistrationData: { [key: string]: number } = {}

  constructor(private http: HttpClient) {
    // Register chart.js components
    Chart.register(...registerables)
  }

  ngOnInit(): void {
    this.loadData()
  }

  ngAfterViewInit(): void {
    // Apply initial font settings
    this.updateFontSettings()
  }

  loadData(): void {
    this.isLoading = true

    // Load photo data
    this.http
      .get<{ [key: string]: number }>(
        "https://photo-challenge-practicum-1.onrender.com/api/Challenge/monthly-photo-report",
      )
      .subscribe({
        next: (report) => {
          this.rawPhotoData = report

          // Load registration data
          this.http
            .get<{ [key: string]: number }>(
              "https://photo-challenge-practicum-1.onrender.com/api/Challenge/monthly-registration-report",
            )
            .subscribe({
              next: (registrationReport) => {
                this.rawRegistrationData = registrationReport
                this.filterDataByTimeRange()
                this.isLoading = false
              },
              error: (error) => {
                console.error("Error loading registration data:", error)
                this.isLoading = false
              },
            })
        },
        error: (error) => {
          console.error("Error loading photo data:", error)
          this.isLoading = false
        },
      })
  }

  filterDataByTimeRange(): void {
    const months = Object.keys(this.rawPhotoData)
    let filteredMonths: string[]

    if (this.selectedTimeRange === "all") {
      filteredMonths = months
    } else {
      const monthCount = Number.parseInt(this.selectedTimeRange)
      filteredMonths = months.slice(-monthCount)
    }

    this.barChartData.labels = filteredMonths
    this.barChartData.datasets[0].data = filteredMonths.map((month) => this.rawPhotoData[month] || 0)
    this.barChartData.datasets[1].data = filteredMonths.map((month) => this.rawRegistrationData[month] || 0)

    if (this.chart) {
      this.chart.update()
    }
  }

  onTimeRangeChange(): void {
    this.filterDataByTimeRange()
  }

  refreshData(): void {
    this.loadData()
  }

  setChartType(type: ChartType): void {
    this.barChartType = type
    if (this.chart) {
      this.chart.update()
    }
  }

  setFontFamily(fontFamily: string): void {
    this.currentFontFamily = fontFamily
    this.updateFontSettings()
  }

  setFontSize(size: string): void {
    this.currentFontSize = size
    this.updateFontSettings()
  }

  updateFontSettings(): void {
    if (!this.barChartOptions || !this.barChartOptions.plugins || !this.barChartOptions.scales) return

    // Update font size multiplier
    const fontSizeMultiplier = this.currentFontSize === "small" ? 0.9 : this.currentFontSize === "large" ? 1.1 : 1

    // Update legend fonts
    if (this.barChartOptions.plugins.legend) {
      this.barChartOptions.plugins.legend.labels = {
        font: {
          family: this.currentFontFamily,
          size: 12 * fontSizeMultiplier,
        },
      }
    }

    // Update tooltip fonts
    if (this.barChartOptions.plugins.tooltip) {
      this.barChartOptions.plugins.tooltip.titleFont = {
        family: this.currentFontFamily,
        size: 14 * fontSizeMultiplier,
      }
      this.barChartOptions.plugins.tooltip.bodyFont = {
        family: this.currentFontFamily,
        size: 13 * fontSizeMultiplier,
      }
    }

    // Update axis fonts
    if (this.barChartOptions.scales["y"]) {
      this.barChartOptions.scales["y"].ticks = {
        ...this.barChartOptions.scales["y"].ticks,
        font: {
          family: this.currentFontFamily,
          size: 11 * fontSizeMultiplier,
        },
      }
    }

    if (this.barChartOptions.scales["x"]) {
      this.barChartOptions.scales["x"].ticks = {
        ...this.barChartOptions.scales["x"].ticks,
        font: {
          family: this.currentFontFamily,
          size: 11 * fontSizeMultiplier,
        },
      }
    }

    // Apply changes to chart
    if (this.chart) {
      this.chart.update()
    }
  }

  setChartTheme(theme: string): void {
    const selectedTheme = this.chartThemes[theme as keyof typeof this.chartThemes] || this.chartThemes.default

    this.barChartData.datasets[0].backgroundColor = selectedTheme.photos.backgroundColor
    this.barChartData.datasets[0].borderColor = selectedTheme.photos.borderColor

    this.barChartData.datasets[1].backgroundColor = selectedTheme.registrations.backgroundColor
    this.barChartData.datasets[1].borderColor = selectedTheme.registrations.borderColor

    if (this.chart) {
      this.chart.update()
    }
  }

  // Download functions
  downloadAsPDF(): void {
    if (!this.chartContainer) return

    const element = this.chartContainer.nativeElement
    const reportTitle = "Monthly_Report_" + new Date().toISOString().split("T")[0]

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("l", "mm", "a4")
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${reportTitle}.pdf`)
    })
  }

  downloadAsImage(): void {
    if (!this.chartContainer) return

    const element = this.chartContainer.nativeElement
    const reportTitle = "Monthly_Report_" + new Date().toISOString().split("T")[0]

    html2canvas(element).then((canvas) => {
      const link = document.createElement("a")
      link.download = `${reportTitle}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    })
  }

  downloadAsCSV(): void {
    if (!this.barChartData.labels || !this.barChartData.datasets) return

    const reportTitle = "Monthly_Report_" + new Date().toISOString().split("T")[0]
    const labels = this.barChartData.labels as string[]
    const photoData = this.barChartData.datasets[0].data as number[]
    const registrationData = this.barChartData.datasets[1].data as number[]

    let csvContent = "Month,Photos,Registrations\n"

    labels.forEach((month, index) => {
      csvContent += `${month},${photoData[index] || 0},${registrationData[index] || 0}\n`
    })

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${reportTitle}.csv`
    link.click()
  }

  printReport(): void {
    window.print()
  }

  // Summary calculations
  getTotalPhotos(): number {
    return (this.barChartData.datasets[0].data as unknown[])
      .filter((value): value is number => typeof value === "number")
      .reduce((sum: number, value: number) => sum + value, 0)
  }

  getTotalRegistrations(): number {
    return (this.barChartData.datasets[1].data as unknown[])
      .filter((value): value is number => typeof value === "number")
      .reduce((sum: number, value: number) => sum + value, 0)
  }

  getGrowthRate(): string {
    const data = this.barChartData.datasets[0].data as number[]
    if (data.length < 2) return "0"

    const currentMonth = data[data.length - 1] || 0
    const previousMonth = data[data.length - 2] || 1 // Avoid division by zero

    const growthRate = ((currentMonth - previousMonth) / previousMonth) * 100
    return growthRate.toFixed(1)
  }
}
