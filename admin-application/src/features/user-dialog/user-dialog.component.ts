import { Component, Inject, type OnInit } from "@angular/core"
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { AuthService } from "../../services/auth/auth.service"
import type { User } from "../../core/moduls/User"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatButtonModule } from "@angular/material/button"
import { CommonModule } from "@angular/common"
import { MatIconModule } from "@angular/material/icon"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { trigger, transition, style, animate } from "@angular/animations"
@Component({
  selector: "app-user-dialog",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: "./user-dialog.component.html",
  styleUrl: "./user-dialog.component.css",
  animations: [
    trigger("slideIn", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(-20px)" }),
        animate("300ms cubic-bezier(0.25, 0.8, 0.25, 1)", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
    ]),
  ],
})

export class UserDialogComponent implements OnInit {
  userForm!: FormGroup
  isEditMode = false
  hidePassword = true
  isSubmitting = false

  constructor(
    private fb: FormBuilder,
    @Inject(AuthService) private userService: AuthService,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: User,
  ) { }

  ngOnInit(): void {
    this.isEditMode = !!this.data

    this.userForm = this.fb.group({
      name: [this.data?.name || "", Validators.required],
      email: [this.data?.email || "", [Validators.required, Validators.email]],
      password: [
        "",
        this.isEditMode
          ? []
          : [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]:;\"'<>,.?/~`]).{8,}$"),
          ],
      ],
      role: [this.data?.role ?? '', Validators.required],
    })
  }

  onSubmit() {
    if (this.userForm.invalid) return

    this.isSubmitting = true
    // const formValue = this.userForm.value
    const formValue = {
      ...this.userForm.value,
      role: this.userForm.value.role
    }
    if (this.isEditMode) {
      this.userService.updateUser(this.data.id, formValue).subscribe({
        next: () => {
          this.snackBar.open("User updated successfully", "Close", {
            duration: 4000,
            panelClass: ["snackbar-success"],
          })
          this.dialogRef.close(true)
        },
        error: () => {
          this.snackBar.open("Failed to update user", "Close", {
            duration: 4000,
            panelClass: ["snackbar-error"],
          })
          this.isSubmitting = false
        },
      })
    } else {
      this.userService.addUser(formValue).subscribe({
        next: () => {
          this.snackBar.open("User added successfully", "Close", {
            duration: 4000,
            panelClass: ["snackbar-success"],
          })
          this.dialogRef.close(true)
        },
        error: () => {
          this.snackBar.open("Failed to add user", "Close", {
            duration: 4000,
            panelClass: ["snackbar-error"],
          })
          this.isSubmitting = false
        },
      })
    }
  }

  cancel() {
    this.dialogRef.close()
  }
}
