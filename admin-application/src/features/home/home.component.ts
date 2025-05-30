import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports: [
    MatIconModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  {

  constructor(private userService: AuthService,private router: Router) {}
   handleClick(path: string) {
    if (this.userService.isSignedIn()) {
      this.router.navigate([path]);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
