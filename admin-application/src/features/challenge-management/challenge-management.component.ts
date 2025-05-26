
import { Component, type OnInit } from "@angular/core"
import { ChallengeService } from "../../services/challenge/challenge.service"
import type { Challenge } from "../../core/moduls/Challenge"
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
import { MatMenuModule } from "@angular/material/menu"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatDividerModule } from "@angular/material/divider"
import { trigger, transition, style, animate } from "@angular/animations"
import { User } from "../../core/moduls/User"
import { AuthService } from "../../services/auth/auth.service"
import { MatDialogModule } from "@angular/material/dialog"

@Component({
  selector: "app-challenge-management",
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
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    MatDialogModule
  ],
  templateUrl: "./challenge-management.component.html",
  styleUrl: "./challenge-management.component.css",
  animations: [
    trigger("fadeAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(20px)" }),
        animate("300ms ease-out", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
      transition(":leave", [animate("300ms ease-in", style({ opacity: 0, transform: "translateY(20px)" }))]),
    ]),
    trigger("slideInOut", [
      transition(":enter", [
        style({ transform: "translateX(-100%)", opacity: 0 }),
        animate("400ms ease-out", style({ transform: "translateX(0)", opacity: 1 })),
      ]),
      transition(":leave", [animate("300ms ease-in", style({ transform: "translateX(-100%)", opacity: 0 }))]),
    ]),
  ],
})
export class ChallengeManagementComponent implements OnInit {
  challengeForm: FormGroup
  showForm = false
  showHistory = false
  activeChallenge!: Challenge
  finishedChallenges: Challenge[] = []
  topicInput = ""
  generatedDescription = ""
  isLoadingHistory = false
  isLoading = true
  isGenerating = false
  isSubmitting = false
  isProcessing = false
  totalChallenges = 0
  userWinnerName: string | null = null;
  constructor(
    private http: HttpClient,
    private challengeService: ChallengeService,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {
    this.challengeForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(3)]],
      description: ["", [Validators.required, Validators.minLength(10)]],
      duration: [7, [Validators.min(1), Validators.max(30)]],
      difficulty: ["medium"],
    })
  }

  ngOnInit(): void {
    this.loadActiveChallenge()
    this.loadChallengeStats()
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

  loadActiveChallenge() {
    this.isLoading = true
    this.challengeService.getActiveChallenge().subscribe({
      next: (challenge) => {
        this.activeChallenge = challenge
        this.isLoading = false
      },
      error: (err) => {
        console.error(err)
        this.isLoading = false
        // Don't show alert for no active challenge - it's a normal state
      },
    })
  }

  loadChallengeStats() {
    this.totalChallenges = 12 // Replace with actual service call
  }

  toggleForm() {
    this.showForm = !this.showForm
    if (!this.showForm) {
      this.challengeForm.reset({
        duration: 7,
        difficulty: "medium",
      })
      this.generatedDescription = ""
      this.topicInput = ""
    }
  }

  submitChallenge() {
    if (this.challengeForm.valid) {
      this.isSubmitting = true
      this.challengeService.addChallenge(this.challengeForm.value).subscribe({
        next: (res) => {
          // Success notification would go here
          console.log("Challenge created successfully!")
          this.challengeForm.reset({
            duration: 7,
            difficulty: "medium",
          })
          this.showForm = false
          this.isSubmitting = false
          this.loadActiveChallenge()
          this.loadChallengeStats()
        },
        error: (err) => {
          console.error("Error creating challenge:", err)
          this.isSubmitting = false
        },
      })
    }
  }

  updateWinner(challengeId: number) {
    if (!challengeId) return

    this.isProcessing = true
    console.log("עדכון תמונה מנצחת לאתגר עם ID:", challengeId)

    this.challengeService.updateWinnerImage(challengeId).subscribe({
      next: (res) => {
        const updatedChallenge = (res as any).challenge
        console.log(`עודכן בהצלחה! תמונה מנצחת ID: ${updatedChallenge.winnerImgId}`)

        // Send email if winner exists
        if (updatedChallenge.winnerUserId) {
          console.log("מייל יישלח למשתמש עם ID:", updatedChallenge.winnerUserId)
          const subject = "מזל טוב! זכית באתגר השבועי 🎉"
          const message = `התמונה שלך נבחרה כמנצחת באתגר "${updatedChallenge.title}"!`

          this.challengeService.sendEmailToWinner(updatedChallenge.winnerUserId, subject, message).subscribe({
            next: () => console.log("המייל נשלח למשתמש הזוכה!"),
            error: (err) => {
              console.error("שליחת מייל נכשלה", err)
            },
          })
        }

        this.loadActiveChallenge()
        this.isProcessing = false
      },
      error: (err) => {
        console.error(err)
        this.isProcessing = false
      },
    })
  }

 viewHistory() {
    this.showHistory = !this.showHistory
    
    if (this.showHistory && this.finishedChallenges.length === 0) {
      this.loadFinishedChallenges()
    }
  }

  loadFinishedChallenges() {
    this.isLoadingHistory = true
    this.challengeService.getPreviousChallenges().subscribe({
      next: (challenges) => {
        this.finishedChallenges = challenges
        this.isLoadingHistory = false
        console.log('Loaded finished challenges:', challenges)
      },
      error: (err) => {
        console.error('Error loading finished challenges:', err)
        this.isLoadingHistory = false
        this.finishedChallenges = []
      }
    })
  }

 trackByChallenge(index: number, challenge: Challenge): number {
  return challenge.id;
}
  refreshData() {
    this.loadActiveChallenge()
    this.loadChallengeStats()
  }

  formatDate(date: string | Date): string {
    if (!date) return ""
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
    getWinnerInfo(challenge: Challenge): string {
    if (challenge.winnerUserId) {
       this.authService.getUserById(challenge.winnerUserId).subscribe({
      next: (user: User) => {
        this.userWinnerName = user.name;
      },
      error: (err:any) => {
        console.error('שגיאה בשליפת המשתמש:', err);
      }
    });
      return `${this.userWinnerName}`
    }
    return challenge.winnerImgId ? 'Winner Selected' : 'No Winner'
  }
  closeHistory() {
    this.showHistory = false
  }
}
