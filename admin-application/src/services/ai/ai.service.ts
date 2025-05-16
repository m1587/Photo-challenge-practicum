import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiService {
private apiUrl = 'https://api-inference.huggingface.co/models/gpt2'; // אפשר לשנות מודל
  private hfToken = environment.huggingfaceToken; // 🔒 אל תשאירי בפרודקשן
  constructor(private http: HttpClient) {}

  generateText(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.hfToken ?? '',
      'Content-Type': 'application/json'
    });

    const body = {
      inputs: prompt
    };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}
