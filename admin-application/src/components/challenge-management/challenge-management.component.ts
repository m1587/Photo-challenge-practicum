import { Component } from '@angular/core';
import { ChallengeService } from '../../services/challenge/challenge.service';
import { Challenge } from '../../moduls/Challenge';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-challenge-management',
  imports: [   CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    BrowserModule,
    FormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './challenge-management.component.html',
  styleUrl: './challenge-management.component.css'
})
export class ChallengeManagementComponent {
  challengeForm: FormGroup;
  showForm: boolean = false;
  activeChallenge!: Challenge;
   topicInput: string = '';
  generatedDescription: string = '';
  isGenerating: boolean = false;
  constructor(
    private http: HttpClient,
    private challengeService: ChallengeService,
    private fb: FormBuilder,
  ) {
    this.challengeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }
 generateDescription() {
  if (!this.topicInput.trim()) return;
  this.isGenerating = true; // ⬅️ התחלה
  const body = { GeneratedText: this.topicInput };
  this.http.post('https://photo-challenge-practicum-1.onrender.com/api/huggingface/generate-description', body, {
    headers: { 'Content-Type': 'application/json' }
  })
  .pipe(finalize(() => this.isGenerating = false))
  .subscribe({
    next: (res: any) => {
      this.generatedDescription = res.description;
      this.challengeForm.get('description')?.setValue(res.description);
      console.log('Generated description:', res.description);
    },
    
    error: err => {
      console.error('Error generating description:', err);
      this.generatedDescription = 'Failed to generate description.';
    }
  });
}

  ngOnInit(): void {
    this.loadActiveChallenge();
  }
  
  loadActiveChallenge() {
    this.challengeService.getActiveChallenge().subscribe({
      next: (challenge) => {
        this.activeChallenge = challenge;
      },
      error: (err) => {
        console.error(err);
        alert('לא נמצא אתגר פעיל כרגע');
      }
    });
  }
  toggleForm() {
    this.showForm = !this.showForm;
  }

  submitChallenge() {
    if (this.challengeForm.valid) {
      this.challengeService.addChallenge(this.challengeForm.value).subscribe({
        next: res => {
          alert('האתגר נוסף בהצלחה!');
          this.challengeForm.reset();
          this.showForm = false;
        },
        error: err => alert('שגיאה בהוספת האתגר.')
      });
    }
  }
  updateWinner(challengeId: number) {
    console.log('עדכון תמונה מנצחת לאתגר עם ID:', challengeId);
    this.challengeService.updateWinnerImage(challengeId).subscribe({
      next: (res) => {
        const updatedChallenge = (res as any).challenge;
        alert(`עודכן בהצלחה! תמונה מנצחת ID: ${updatedChallenge.winnerImgId}`);      
        // נשלח מייל מותאם אם יש winnerUserId
        if (updatedChallenge.winnerUserId) {
          console.log('מייל יישלח למשתמש עם ID:', updatedChallenge.winnerUserId);
          const subject = 'מזל טוב! זכית באתגר השבועי 🎉';
          const message = `התמונה שלך נבחרה כמנצחת באתגר "${updatedChallenge.title}"!`;
  
          this.challengeService.sendEmailToWinner(updatedChallenge.winnerUserId, subject, message).subscribe({
            next: () => alert('המייל נשלח למשתמש הזוכה!'),
            error: err => {
              console.error('שליחת מייל נכשלה', err);
              alert('שליחת המייל נכשלה.');
            }
          });
        } else {
          alert('לא נמצא משתמש מנצח לשליחת המייל.');
        }
  
        this.loadActiveChallenge();
      },
      error: (err) => {
        console.error(err);
        alert("שגיאה בעדכון התמונה המנצחת. ודא שיש תמונות לאתגר.");
      }
    }); 
}

}
