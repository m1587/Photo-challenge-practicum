import { Component, EventEmitter, Output } from "@angular/core"
import { ChallengeService } from "../../../services/challenge/challenge.service"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { MatButtonModule } from "@angular/material/button"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { FormsModule } from "@angular/forms"
import { HttpClient } from "@angular/common/http"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSelectModule } from "@angular/material/select"
import { MatTooltipModule } from "@angular/material/tooltip"
import { trigger, transition, style, animate } from "@angular/animations"
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: "app-challenge-create",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  templateUrl: "./challenge-create.component.html",
  styleUrl: "./challenge-create.component.css",
  animations: [
    trigger("fadeAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(20px)" }),
        animate("300ms ease-out", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
      transition(":leave", [animate("300ms ease-in", style({ opacity: 0, transform: "translateY(20px)" }))]),
    ]),
  ],
})
export class ChallengeCreateComponent {
  @Output() challengeCreated = new EventEmitter<void>()
  @Output() closeForm = new EventEmitter<void>()

  challengeForm: FormGroup
  topicInput = ""
  generatedDescription = ""
  isGenerating = false
  isSubmitting = false

  constructor(
    private http: HttpClient,
    private challengeService: ChallengeService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.challengeForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(3)]],
      description: ["", [Validators.required, Validators.minLength(10)]],
      duration: [7, [Validators.min(1), Validators.max(30)]],
      difficulty: ["medium"],
    })
  }

  generateDescription() {
    if (!this.topicInput.trim()) return

    this.isGenerating = true
    const body = { GeneratedText: this.topicInput }

    this.http
      .post("https://photo-challenge-practicum-1.onrender.com/api/huggingface/generate-description", body, {
        headers: { "Content-Type": "application/json" },
      })
      .subscribe({
        next: (res: any) => {
          this.generatedDescription = res.description
          this.isGenerating = false
          console.log("Generated description:", res.description)
        },
        error: (err) => {
          console.error("Error generating description:", err)
          this.generatedDescription = "Failed to generate description. Please try again."
          
          this.isGenerating = false
        },
      })
  }

  useGeneratedDescription() {
    this.challengeForm.get("description")?.setValue(this.generatedDescription)
    this.generatedDescription = ""
  }

  onClose() {
    this.challengeForm.reset({
      duration: 7,
      difficulty: "medium",
    })
    this.generatedDescription = ""
    this.topicInput = ""
    this.closeForm.emit()
  }

  submitChallenge() {
    if (this.challengeForm.valid) {
      this.isSubmitting = true
      this.challengeService.addChallenge(this.challengeForm.value).subscribe({
        next: (res) => {
           this.snackBar.open("Challenge created successfully", "Close", {
          duration: 4000,
          panelClass: ['snackbar-success'],
        });
          this.challengeForm.reset({
            duration: 7,
            difficulty: "medium",
          })
          this.generatedDescription = ""
          this.topicInput = ""
          this.isSubmitting = false
          this.challengeCreated.emit()
          this.closeForm.emit()
        },
        error: (err) => {
         this.snackBar.open("Failed to create challenge", "Close", {
          duration: 4000,
          panelClass: ['snackbar-error'],
        });
          this.isSubmitting = false
        },
      })
    }
  }
}