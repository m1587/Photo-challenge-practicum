import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../moduls/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7282/api/User';
  private userId: string | null = null;
  private userRole: string | null = null;
  constructor(private http: HttpClient) { }
  private signedIn = false;

  isSignedIn(): boolean {
    return this.signedIn;
  }

  signIn(): void {
    this.signedIn = true;
  }

  signOut(): void {
    this.signedIn = false;
  }
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }
// --- CRUD למשתמשים ---

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
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    console.log(id);
    // Check if the userId is null or undefined before making the request
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  // --- ניהול טוקן וזהות משתמש ---
  storeToken(token: string) {
    sessionStorage.setItem('token', token);
  }

  storeUserId(userId: string): void {
    this.userId = userId;
    localStorage.setItem('userId', userId);
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  storeUserRole(userRole: string): void {
    this.userRole = userRole;
    localStorage.setItem('userRole', userRole);
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }
  
}
