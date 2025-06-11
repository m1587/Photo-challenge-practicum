import { CommonModule } from "@angular/common"
import { Component } from "@angular/core"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatMenuModule } from "@angular/material/menu"
import { RouterLink, RouterOutlet, Router } from "@angular/router"
import { AuthService } from "../../services/auth/auth.service"
import { MatDividerModule } from "@angular/material/divider"
import { ThemeService } from "../../services/theme/theme.service"
import { MatTooltipModule } from "@angular/material/tooltip"

@Component({
  selector: "app-navbar",
  imports: [
    CommonModule,
    RouterLink,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterOutlet,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent {
  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    private router: Router,
  ) { }

  toggleTheme(): void {
    this.themeService.toggleTheme()
  }

  getUserName(): string {
 
    return this.authService.getUser()?.name?.toString() ?? "";
  }

  getUserEmail(): string {

    return this.authService.getUser()?.email?.toString() ?? "";
  }
  getUserInitial(): string {
    const name = this.getUserName(); 
    return name ? name.charAt(0).toUpperCase() : '?';
  }
  signOut(): void {

    this.authService.signOut()

    this.router.navigate(["/"])
  }
}
