// import { Component } from '@angular/core';
// import { ChallengeService } from '../../services/challenge/challenge.service';
// import { Challenge } from '../../core/moduls/Challenge';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { MatButtonModule } from '@angular/material/button';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatCardModule } from '@angular/material/card';
// import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';
// import { BrowserModule } from '@angular/platform-browser';
// import { FormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { finalize } from 'rxjs';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// @Component({
//   selector: 'app-challenge-management',
//   imports: [   CommonModule,
//     ReactiveFormsModule,
//     MatButtonModule,
//     MatCardModule,
//     MatFormFieldModule,
//     MatIconModule,
//     MatInputModule,
//     BrowserModule,
//     FormsModule,
//     MatProgressSpinnerModule,
//   ],
//   templateUrl: './challenge-management.component.html',
//   styleUrl: './challenge-management.component.css'
// })
// export class ChallengeManagementComponent {
//   challengeForm: FormGroup;
//   showForm: boolean = false;
//   activeChallenge!: Challenge;
//    topicInput: string = '';
//   generatedDescription: string = '';
//   constructor(
//     private http: HttpClient,
//     private challengeService: ChallengeService,
//     private fb: FormBuilder,
//   ) {
//     this.challengeForm = this.fb.group({
//       title: ['', Validators.required],
//       description: ['', Validators.required]
//     });
//   }
//  generateDescription() {
//   if (!this.topicInput.trim()) return;
//   const body = { GeneratedText: this.topicInput };
//   this.http.post('https://photo-challenge-practicum-1.onrender.com/api/huggingface/generate-description', body, {
//     headers: { 'Content-Type': 'application/json' }
//   })
//   .subscribe({
//     next: (res: any) => {
//       this.generatedDescription = res.description;
//       this.challengeForm.get('description')?.setValue(res.description);
//       console.log('Generated description:', res.description);
//     },
    
//     error: err => {
//       console.error('Error generating description:', err);
//       this.generatedDescription = 'Failed to generate description.';
//     }
//   });
// }

//   ngOnInit(): void {
//     this.loadActiveChallenge();
//   }
  
//   loadActiveChallenge() {
//     this.challengeService.getActiveChallenge().subscribe({
//       next: (challenge) => {
//         this.activeChallenge = challenge;
//       },
//       error: (err) => {
//         console.error(err);
//         alert('לא נמצא אתגר פעיל כרגע');
//       }
//     });
//   }
//   toggleForm() {
//     this.showForm = !this.showForm;
//   }

//   submitChallenge() {
//     if (this.challengeForm.valid) {
//       this.challengeService.addChallenge(this.challengeForm.value).subscribe({
//         next: res => {
//           alert('האתגר נוסף בהצלחה!');
//           this.challengeForm.reset();
//           this.showForm = false;
//         },
//         error: err => alert('שגיאה בהוספת האתגר.')
//       });
//     }
//   }
//   updateWinner(challengeId: number) {
//     console.log('עדכון תמונה מנצחת לאתגר עם ID:', challengeId);
//     this.challengeService.updateWinnerImage(challengeId).subscribe({
//       next: (res) => {
//         const updatedChallenge = (res as any).challenge;
//         alert(`עודכן בהצלחה! תמונה מנצחת ID: ${updatedChallenge.winnerImgId}`);      
//         // נשלח מייל מותאם אם יש winnerUserId
//         if (updatedChallenge.winnerUserId) {
//           console.log('מייל יישלח למשתמש עם ID:', updatedChallenge.winnerUserId);
//           const subject = 'מזל טוב! זכית באתגר השבועי 🎉';
//           const message = `התמונה שלך נבחרה כמנצחת באתגר "${updatedChallenge.title}"!`;
  
//           this.challengeService.sendEmailToWinner(updatedChallenge.winnerUserId, subject, message).subscribe({
//             next: () => alert('המייל נשלח למשתמש הזוכה!'),
//             error: err => {
//               console.error('שליחת מייל נכשלה', err);
//               alert('שליחת המייל נכשלה.');
//             }
//           });
//         } else {
//           alert('לא נמצא משתמש מנצח לשליחת המייל.');
//         }
  
//         this.loadActiveChallenge();
//       },
//       error: (err) => {
//         console.error(err);
//         alert("שגיאה בעדכון התמונה המנצחת. ודא שיש תמונות לאתגר.");
//       }
//     }); 
// }

// }
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
  activeChallenge!: Challenge
  topicInput = ""
  generatedDescription = ""
  isLoading = true
  isGenerating = false
  isSubmitting = false
  isProcessing = false
  totalChallenges = 0

  constructor(
    private http: HttpClient,
    private challengeService: ChallengeService,
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
    // This would typically come from your service
    // For now, using a placeholder
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

  saveDraft() {
    // Save form data to localStorage or service
    const draftData = this.challengeForm.value
    localStorage.setItem("challengeDraft", JSON.stringify(draftData))
    console.log("Draft saved!")
  }

  exportChallenges() {
    // Export functionality
    console.log("Exporting challenges...")
  }

  viewHistory() {
    // Navigate to history view
    console.log("Viewing challenge history...")
  }

  viewChallengeDetails() {
    // Show detailed view of active challenge
    console.log("Viewing challenge details...")
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
}
