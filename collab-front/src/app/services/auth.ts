import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

//Envoi vers le back
interface AuthRequest {
  name?: string;
  email?: string;
  password: string;
}

//Réception du front
interface AuthResponse {
  token?: string;
  userId: number;
  email?: string;
  name?: string;
  workspaceId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = "http://localhost:8086/auth";

  constructor(private httpClient: HttpClient, private router: Router) {}

  //inscription
  register(name: string, email: string, password: string) {
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}/register`, { name, email, password })
      .pipe(tap(response => this.saveSession(response)));
  }

  //login
  login(email: string, password: string) {
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(response => this.saveSession(response)));
  }

  //logout
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  //Récupérer le token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  //Récupérer le userId courant (utilisé partout dans l'app)
  getCurrentUserId(): number {
    return Number(localStorage.getItem('userId'));
  }

  //Sauvegarder les infos de la session dans le localStorage
  saveSession(response: AuthResponse) {
    localStorage.setItem('token', response.token ?? '');
    localStorage.setItem('userId', response.userId.toString());
    localStorage.setItem('userName', response.name ?? '');
    localStorage.setItem('userEmail', response.email ?? '');
    if (response.workspaceId) {
      localStorage.setItem('workspaceId', response.workspaceId.toString());
    }
  }
}
