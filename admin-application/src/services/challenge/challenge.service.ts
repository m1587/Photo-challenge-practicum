import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Challenge } from '../../moduls/Challenge';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  private apiUrl = 'https://photo-challenge-practicum-1.onrender.com/api/Challenge';

  constructor(private http: HttpClient) { }

  // הוספת אתגר חדש
  addChallenge(challenge: Partial<Challenge>): Observable<Challenge> {
    return this.http.post<Challenge>(this.apiUrl, challenge);
  }

  // סיום אתגר פעיל ועדכון תמונה מנצחת
  getLastWinner(): Observable<Challenge> {
    return this.http.get<Challenge>(`${this.apiUrl}/last-winner`);
  }

  // קבלת האתגר הפעיל האחרון
  getActiveChallenge(): Observable<Challenge> {
    return this.http.get<Challenge>(`${this.apiUrl}/active-challenge`);
  }

  // בדיקה אם משתמש העלה תמונה לאתגר
  checkIfUserUploaded(userId: number, challengeId: number): Observable<{ hasUploaded: boolean }> {
    return this.http.get<{ hasUploaded: boolean }>(
      `${this.apiUrl}/check-uploaded?userId=${userId}&challengeId=${challengeId}`
    );
  }

  // קבלת אתגרים שהסתיימו
  getPreviousChallenges(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(`${this.apiUrl}/previous-challenges`);
  }
  // קריאה לעדכון תמונה מנצחת לפי challengeId
  updateWinnerImage(challengeId: number): Observable<Challenge> {
    return this.http.post<Challenge>(`${this.apiUrl}/${challengeId}/calculate-winner`, {});
  }

  // שליחת מייל למשתמש לפי ID
  sendEmailToWinner(userId: number, subject: string, message: string): Observable<any> {
    const emailData = {
      Name: '',
      Email: '',
      Subject: subject,
      Message: message,
    };
    return this.http.post<any>(`https://localhost:7282/api/Contact/send-email-to-user/${userId}`, emailData);
  }

}
