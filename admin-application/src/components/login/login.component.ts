import { Component } from '@angular/core';
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
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  submitted = false;
  errorMessage!: string;
  hide = false
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
  }
  get formControls() {
    return this.loginForm.get('userDetails') as FormGroup;
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
        alert("login successful 😝😁😊");
        this.authService.signIn();
        this.authService.storeToken(response.token);
        this.authService.storeUserId(response.userId);
        this.authService.storeUserRole(response.role);
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = 'גישה מיועדת רק למנהלים';
        alert(this.errorMessage);
      }
      },
      error => {
        this.errorMessage = error.error.message + 'Login error, please try again.';
        alert(this.errorMessage)
      }
    );
  }
}
