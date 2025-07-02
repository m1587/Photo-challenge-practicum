import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../core/moduls/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private apiUrl = 'https://photo-challenge-practicum-1.onrender.com/api/User';
  constructor(private http: HttpClient) { }
  private signedIn = false;

  storeUser(user: User): void {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
  

  getUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    const saved = localStorage.getItem('currentUser');
    if (saved) {
      this.currentUser = JSON.parse(saved);
      return this.currentUser;
    }

    return null;
  }

  clearUser(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  isSignedIn(): boolean {
    return this.signedIn || !!sessionStorage.getItem('token');
  }

  signIn(): void {
    this.signedIn = true;
  }

  signOut(): void {
  this.signedIn = false;
  this.clearUser();
  sessionStorage.removeItem('token'); // מוחק את הטוקן
}
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // קבלת כל המשתמשים (Admin)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  addUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<any> {
    console.log(`Updating user with ID: ${id}`, user);
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  // --- ניהול טוקן וזהות משתמש ---
  storeToken(token: string) {
    sessionStorage.setItem('token', token);
  }
  getUserId(): string | null {
    return this.getUser()?.id?.toString() ?? null;
  }

  getUserRole(): string | null {
    return this.getUser()?.role ?? null;
  }
}
