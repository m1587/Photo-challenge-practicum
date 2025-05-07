import { Component } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { HomeComponent } from "../components/home/home.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'admin-application';
}
