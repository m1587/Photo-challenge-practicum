
import { Component, type OnInit } from "@angular/core"
import { ChallengeService } from "../../../services/challenge/challenge.service"
import type { Challenge } from "../../../core/moduls/Challenge"
import { FormBuilder } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { HttpClient } from "@angular/common/http"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSelectModule } from "@angular/material/select"
import { MatMenuModule } from "@angular/material/menu"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatDividerModule } from "@angular/material/divider"
import { trigger, transition, style, animate } from "@angular/animations"
import { User } from "../../../core/moduls/User"
import { AuthService } from "../../../services/auth/auth.service"
import { MatDialogModule } from "@angular/material/dialog"
import { ChallengeCreateComponent } from "../challenge-create/challenge-create.component";
import { ChallengeHistoryComponent } from "../challenge-history/challenge-history.component";

@Component({
  selector: "app-challenge-management",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    MatDialogModule,
    ChallengeHistoryComponent,
    ChallengeCreateComponent
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
  showForm = false
  showHistory = false
  activeChallenge!: Challenge
  finishedChallenges: Challenge[] = []
  isLoadingHistory = false
  isLoading = true
  isProcessing = false
  totalChallenges = 0
  userWinnerName: string | null = null;

  constructor(
    private http: HttpClient,
    private challengeService: ChallengeService,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.loadActiveChallenge()
    this.loadChallengeStats()
  }

  onChallengeCreated() {
    this.loadActiveChallenge();
    this.toggleForm(); // או this.showForm = false;
  }

  closeCreateForm() {
    this.toggleForm(); // או this.showForm = false;
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
  }


 updateWinner(challengeId: number) {
    if (!challengeId) return

    this.isProcessing = true
    console.log("Updating winning image for challenge ID:", challengeId)

    this.challengeService.updateWinnerImage(challengeId).subscribe({
      next: (res) => {
        const updatedChallenge = (res as any).challenge
        console.log(`Successfully updated! Winner image ID: ${updatedChallenge.winnerImgId}`)

        // Send email if winner exists
        if (updatedChallenge.winnerUserId) {
          console.log("Sending email to user with ID:", updatedChallenge.winnerUserId)
          const subject = "Congratulations! You won the weekly challenge"
          const message = `Your image was selected as the winner for the challenge "${updatedChallenge.title}"!`

          this.challengeService.sendEmailToWinner(updatedChallenge.winnerUserId, subject, message).subscribe({
            next: () => console.log("Email sent to the winning user!"),
            error: (err) => {
              console.error("Failed to send email", err)
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

  }


  trackByChallenge(index: number, challenge: Challenge): number {
    return challenge.id;
  }
  refreshData() {
    this.loadActiveChallenge()
    this.loadChallengeStats()
  }

  getWinnerInfo(challenge: Challenge): string {
    if (challenge.winnerUserId) {
      this.authService.getUserById(challenge.winnerUserId).subscribe({
        next: (user: User) => {
          this.userWinnerName = user.name;
        },
        error: (err: any) => {
         console.error('Error fetching user:', err);
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
