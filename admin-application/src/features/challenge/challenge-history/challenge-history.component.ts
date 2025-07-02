import { Component, EventEmitter, type OnInit, Output } from "@angular/core"
import { ChallengeService } from "../../../services/challenge/challenge.service"
import { AuthService } from "../../../services/auth/auth.service"
import { Challenge } from "../../../core/moduls/Challenge"
import type { User } from "../../../core/moduls/User"
import { CommonModule } from "@angular/common"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { trigger, transition, style, animate, query, stagger } from "@angular/animations"

@Component({
  selector: "app-challenge-history",
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: "./challenge-history.component.html",
  styleUrl: "./challenge-history.component.css",
  animations: [
    trigger("fadeAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(20px)" }),
        animate("500ms cubic-bezier(0.25, 0.8, 0.25, 1)", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
      transition(":leave", [animate("300ms ease-in", style({ opacity: 0, transform: "translateY(-10px)" }))]),
    ]),
    trigger("slideInOut", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(30px)" }),
        animate("600ms cubic-bezier(0.25, 0.8, 0.25, 1)", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
      transition(":leave", [animate("300ms ease-in", style({ opacity: 0, transform: "translateY(-20px)" }))]),
    ]),
    trigger("staggerAnimation", [
      transition("* => *", [
        query(
          ":enter",
          [
            style({ opacity: 0, transform: "translateY(30px)" }),
            stagger(100, [
              animate("400ms cubic-bezier(0.25, 0.8, 0.25, 1)", style({ opacity: 1, transform: "translateY(0)" })),
            ]),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
})
export class ChallengeHistoryComponent implements OnInit {
  @Output() closeHistory = new EventEmitter<void>()

  finishedChallenges: Challenge[] = []
  isLoadingHistory = false
  userWinnerName: string | null = null

  constructor(
    private challengeService: ChallengeService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {

    this.loadFinishedChallenges()
  }

  loadFinishedChallenges() {
    this.isLoadingHistory = true
    this.challengeService.getPreviousChallenges().subscribe({
      next: (challenges) => {
        this.finishedChallenges = challenges
        this.isLoadingHistory = false
        console.log("Loaded finished challenges:", this.finishedChallenges)
      },
      error: (err) => {
        console.error("Error loading finished challenges:", err)
        this.isLoadingHistory = false
        this.finishedChallenges = []
      },
    })

  }

  trackByChallenge(index: number, challenge: Challenge): number {
    return challenge.id
  }
  getChallengeDuration(challenge: Challenge): number {
    const start = new Date(challenge.startDate)
    const end = new Date(challenge.endDate)
    const diffInMs = end.getTime() - start.getTime()
    const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24))
    return diffInDays
  }

  onClose() {
    this.closeHistory.emit()
  }

  refreshHistory() {

    this.loadFinishedChallenges()
  }
}
