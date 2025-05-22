import { Component } from '@angular/core';
import { NavbarComponent } from '../features/navbar/navbar.component';
import { HomeComponent } from "../features/home/home.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'admin-application';
}
