import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatDividerModule } from "@angular/material/divider"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { AuthService } from "../../services/auth/auth.service"
import type { User } from "../../core/moduls/User"
import { ERole } from "../../core/moduls/ERole"

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup
  currentUser: User | null = null
  isEditing = false
  isSaving = false

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser()
    this.initForm()
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      name: [this.currentUser?.name || "", Validators.required],
      email: [this.currentUser?.email || "", [Validators.required, Validators.email]],
      password: "",
      role: ERole.Admin
    })


    this.profileForm.disable()
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing

    if (this.isEditing) {
      this.profileForm.enable()
    } else {
      this.profileForm.disable()
      this.initForm() 
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return

    this.isSaving = true

    const formValues = this.profileForm.value

    if (this.currentUser) {
      this.authService
        .updateUser(this.currentUser.id, formValues)
        .subscribe({
          next: (updatedUser) => {
            this.currentUser = updatedUser
            this.isSaving = false
            this.isEditing = false
            this.profileForm.disable()
            console.log("Profile updated successfully:", updatedUser)
            // Update stored user
            localStorage.setItem("currentUser", JSON.stringify(updatedUser))

            this.snackBar.open("Profile updated successfully", "Close", {
              duration: 3000,
              panelClass: ["snackbar-success"],
            })
            window.location.reload();
          },
          error: (err) => {
            console.error("Error updating profile:", err)
            this.isSaving = false

            this.snackBar.open("Failed to update profile", "Close", {
              duration: 3000,
              panelClass: ["snackbar-error"],
            })
          },
        })
    }
  }

  getUserInitials(): string {
    if (!this.currentUser?.name) return ""
    const nameParts = this.currentUser.name.split(" ")
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase()
    } else {
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
    }
  }
}
