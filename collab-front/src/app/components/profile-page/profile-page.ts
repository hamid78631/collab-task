import { Component, OnInit, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';
import { AuthService } from '../../services/auth';
import { UserDTO } from '../../models/user.model';

@Component({
  selector: 'app-profile-page',
  imports: [RouterLink, FormsModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePageComponent implements OnInit {

  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  user = signal<UserDTO | null>(null);

  // Champs du formulaire
  editName = signal('');
  editEmail = signal('');
  currentPassword = signal('');
  newPassword = signal('');

  saving = signal(false);
  successMsg = signal('');
  errorMsg = signal('');

  ngOnInit() {
    const userId = this.authService.getCurrentUserId();
    this.userService.getUserById(userId).subscribe({
      next: (u) => {
        this.user.set(u);
        this.editName.set(u.name);
        this.editEmail.set(u.email);
      },
      error: () => this.errorMsg.set('Impossible de charger le profil.')
    });
  }

  save() {
    if (!this.currentPassword().trim()) {
      this.errorMsg.set('Le mot de passe actuel est requis pour sauvegarder.');
      return;
    }
    if (!this.editName().trim()) {
      this.errorMsg.set('Le nom ne peut pas être vide.');
      return;
    }

    this.saving.set(true);
    this.errorMsg.set('');
    this.successMsg.set('');

    const updated: UserDTO = {
      ...this.user()!,
      name: this.editName().trim(),
      email: this.editEmail().trim(),
      password: this.newPassword().trim() || this.currentPassword().trim(),
    };

    this.userService.updateUser(this.user()!.id!, updated).subscribe({
      next: (result) => {
        this.user.set(result);
        localStorage.setItem('userName', result.name);
        localStorage.setItem('userEmail', result.email);
        this.newPassword.set('');
        this.currentPassword.set('');
        this.successMsg.set('Profil mis à jour avec succès.');
        this.saving.set(false);
      },
      error: () => {
        this.errorMsg.set('Erreur lors de la mise à jour. Vérifiez votre mot de passe.');
        this.saving.set(false);
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  get initials(): string {
    const name = this.editName() || this.user()?.name || '';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }
}