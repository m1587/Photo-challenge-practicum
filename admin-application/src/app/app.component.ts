import { Component } from '@angular/core';
import { NavbarComponent } from '../features/navbar/navbar.component';
import { HomeComponent } from "../features/home/home.component";
import { FooterComponent } from '../features/footer/footer/footer.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
