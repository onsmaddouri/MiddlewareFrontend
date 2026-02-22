import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service'; // <-- ajoute ça

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient , private storageService: StorageService) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        username,
        email,
        password,
      },
      httpOptions
    );
  }

  logout(): void {
    this.storageService.clean(); // <-- Vide le sessionStorage
  }

  forgotPasswordEmail(email: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'forgot-password-email',
      { email },
      httpOptions
    );
  }

  resetPasswordEmail(email: string, code: string, newPassword: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'reset-password-email',
      { email, code, newPassword },
      httpOptions
    );
  }
}
