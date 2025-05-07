import { Component, OnInit } from '@angular/core';
import { User } from '../../moduls/User';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth/auth.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-management',
  imports: [
    MatTableModule ,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'actions'];
  users: User[] = [];

  constructor(private userService: AuthService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getAllUsers().subscribe(users => this.users = users);
  }

  openDialog(user?: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: user,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchUsers();
    });
  }

  deleteUser(id: number) {
    if (confirm("Are you sure you want to delete this user?")) {
      this.userService.deleteUser(id).subscribe(() => this.fetchUsers());
    }
  }
}
