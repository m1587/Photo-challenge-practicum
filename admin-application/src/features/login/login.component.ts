import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  submitted = false;
  errorMessage!: string;
  hide = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  get formControls() {
    return this.loginForm.get('userDetails') as FormGroup;
  }

  get emailControl() {
    return this.formControls.get('email');
  }

  get passwordControl() {
    return this.formControls.get('password');
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userDetails: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      })
    });
  }
  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
       this.snackBar.open("Please fill in all required fields correctly.", "OK", {
      duration: 4000,
      panelClass: ['snackbar-error']
    });
      return;
    }
    console.log('Submitted:', this.loginForm.value);
    this.authService.login(
      this.formControls.get('email')?.value,
      this.formControls.get('password')?.value,
    ).subscribe(
      response => {
        console.log(response);
        if (response.user.role === 'Admin') {
           this.snackBar.open("Successfully logged in! Welcome to the admin panel.", "Continue", {
          duration: 4000,
          panelClass: ['snackbar-success']
        });
          this.authService.signIn();
          this.authService.storeToken(response.token);
          console.log('Token stored:', response);
          this.authService.storeUser(response.user);
          // this.authService.storeUserId(response.userId);
          // this.authService.storeUserRole(response.role);
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'Access restricted to administrators only';
           this.snackBar.open(this.errorMessage, "OK", {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
        }
      },
      error => {
        this.errorMessage = error.error.message + ' Login error, please try again.';
        this.snackBar.open(this.errorMessage, "Retry", {
        duration: 6000,
        panelClass: ['snackbar-error']
      });
      }
    );
  }
}
