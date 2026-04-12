import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {

  email = '';
  password = '';
  errorMessage = signal('');
  isLoading = signal(false);
  showPassword = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (typeof err.error === 'string') {
          this.errorMessage.set(err.error);
        } else if (err.status === 404) {
          this.errorMessage.set('Aucun compte trouvé avec cet email');
        } else if (err.status === 401) {
          this.errorMessage.set('Mot de passe incorrect');
        } else {
          this.errorMessage.set('Une erreur est survenue, réessaie.');
        }
      }
    });
  }
}