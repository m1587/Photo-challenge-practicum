import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../core/moduls/User';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-user-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.css'
})
export class UserDialogComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  hidePassword = true
  constructor(
    private fb: FormBuilder,
    private userService: AuthService,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) { }

  ngOnInit(): void {
    this.isEditMode = !!this.data;

    this.userForm = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      role: [this.data?.role || '', Validators.required]
    });
  }

  onSubmit() {
  if (this.userForm.invalid) return;

  const formValue = this.userForm.value;

  if (this.isEditMode) {
    this.userService.updateUser(this.data.id, formValue).subscribe(
      () => {
        this.snackBar.open("User updated successfully", "Close", {
          duration: 4000,
          panelClass: ['snackbar-success']
        });
        this.dialogRef.close(true);
      },
      () => {
        this.snackBar.open("Failed to update user", "Close", {
          duration: 4000,
          panelClass: ['snackbar-error']
        });
      }
    );
  } else {
    this.userService.addUser(formValue).subscribe(
      () => {
        this.snackBar.open("User added successfully", "Close", {
          duration: 4000,
          panelClass: ['snackbar-success']
        });
        this.dialogRef.close(true);
      },
      () => {
        this.snackBar.open("Failed to add user", "Close", {
          duration: 4000,
          panelClass: ['snackbar-error']
        });
      }
    );
  }
}


  cancel() {
    this.dialogRef.close();
  }
}
