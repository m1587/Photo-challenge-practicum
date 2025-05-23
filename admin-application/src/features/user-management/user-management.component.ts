// import { Component, OnInit } from '@angular/core';
// import { User } from '../../core/moduls/User';
// import { CommonModule } from '@angular/common';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatCardModule } from '@angular/material/card';
// import { AuthService } from '../../services/auth/auth.service';
// import { UserDialogComponent } from '../../features/user-dialog/user-dialog.component';
// import { MatTableModule } from '@angular/material/table';
// import { MatDialog } from '@angular/material/dialog';

// @Component({
//   selector: 'app-user-management',
//   imports: [
//     MatTableModule ,
//     CommonModule,
//     MatButtonModule,
//     MatIconModule,
//     MatToolbarModule,
//     MatCardModule
//   ],
//   templateUrl: './user-management.component.html',
//   styleUrl: './user-management.component.css'
// })
// export class UserManagementComponent implements OnInit {
//   displayedColumns: string[] = ['id', 'name', 'email', 'role', 'actions'];
//   users: User[] = [];

//   constructor(private userService: AuthService, private dialog: MatDialog) {}

//   ngOnInit(): void {
//     this.fetchUsers();
//   }

//   fetchUsers() {
//     this.userService.getAllUsers().subscribe(users => this.users = users);
//   }

//   openDialog(user?: User) {
//     const dialogRef = this.dialog.open(UserDialogComponent, {
//       data: user,
//       width: '400px'
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result) this.fetchUsers();
//     });
//   }

//   deleteUser(id: number) {
//     if (confirm("Are you sure you want to delete this user?")) {
//       this.userService.deleteUser(id).subscribe(() => this.fetchUsers());
//     }
//   }
// }
import { Component, type OnInit, ViewChild, type TemplateRef, type AfterViewInit } from "@angular/core"
import type { User } from "../../core/moduls/User"
import { CommonModule } from "@angular/common"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatCardModule } from "@angular/material/card"
import { AuthService } from "../../services/auth/auth.service"
import { UserDialogComponent } from "../../features/user-dialog/user-dialog.component"
import { MatTableModule } from "@angular/material/table"
import { MatDialog, MatDialogModule } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatPaginatorModule, MatPaginator } from "@angular/material/paginator"
import { MatSortModule, MatSort } from "@angular/material/sort"
import { MatMenuModule } from "@angular/material/menu"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatTooltipModule } from "@angular/material/tooltip"
import { FormsModule } from "@angular/forms"
import { MatTableDataSource } from "@angular/material/table"
import { trigger, transition, style, animate } from "@angular/animations"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

@Component({
  selector: "app-user-management",
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    FormsModule,
  ],
  templateUrl: "./user-management.component.html",
  styleUrl: "./user-management.component.css",
  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({ transform: "translateX(100%)", opacity: 0 }),
        animate("300ms ease-out", style({ transform: "translateX(0)", opacity: 1 })),
      ]),
      transition(":leave", [animate("300ms ease-in", style({ transform: "translateX(100%)", opacity: 0 }))]),
    ]),
  ],
})
export class UserManagementComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ["id", "name", "email", "role", "status", "actions"]
  users: User[] = []
  dataSource = new MatTableDataSource<User>([])
  selectedUser: User | null = null
  isLoading = true

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  @ViewChild("confirmDialog") confirmDialogRef!: TemplateRef<any>
  @ViewChild("input") input: any

  constructor(
    private userService: AuthService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.fetchUsers()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  fetchUsers() {
    this.isLoading = true
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users
        this.dataSource.data = users
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error fetching users:", error)
        this.isLoading = false
      },
    })
  }

  openDialog(user?: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: user,
      width: "400px",
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchUsers()
        if (this.selectedUser && user && this.selectedUser.id === user.id) {
          // Update selected user if it was edited
          this.selectedUser = this.users.find((u) => u.id === user.id) || null
        }
      }
    })
  }

  confirmDelete(user: User) {
    const dialogRef = this.dialog.open(this.confirmDialogRef)

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser(user.id)
      }
    })
  }

  deleteUser(id: number) {
    this.isLoading = true
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.fetchUsers()
        if (this.selectedUser && this.selectedUser.id === id) {
          this.selectedUser = null
        }
      },
      error: (error) => {
        console.error("Error deleting user:", error)
        this.isLoading = false
      },
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  filterByRole(role: string) {
    if (role === "all") {
      this.dataSource.data = this.users
    } else {
      this.dataSource.data = this.users.filter((user) => user.role === role)
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  selectUser(user: User) {
    this.selectedUser = this.selectedUser && this.selectedUser.id === user.id ? null : user
  }

  getUserInitials(name: string): string {
    if (!name) return ""

    const nameParts = name.split(" ")
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase()
    } else {
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
    }
  }

  getAdminCount(): number {
    return this.users.filter((user) => user.role === "Admin").length
  }

  getUserCount(): number {
    return this.users.filter((user) => user.role === "User").length
  }

  exportToCsv() {
    const csvData = this.prepareExportData()
    const csvContent = this.convertToCSV(csvData)

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", "users_export.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  exportToPdf() {
    const doc = new jsPDF()
    const userData = this.prepareExportData()

    autoTable(doc, {
      head: [["ID", "Name", "Email", "Role"]],
      body: userData.map((user) => [user.id, user.name, user.email, user.role]),
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [99, 102, 241] },
    })

    doc.save("users_export.pdf")
  }

  private prepareExportData(): any[] {
    // Use filtered data if available, otherwise use all users
    return this.dataSource.filteredData.length > 0 ? this.dataSource.filteredData : this.users
  }

  private convertToCSV(data: any[]): string {
    const header = "ID,Name,Email,Role\n"
    const rows = data.map((user) => `${user.id},"${user.name}","${user.email}","${user.role}"`)

    return header + rows.join("\n")
  }
}
