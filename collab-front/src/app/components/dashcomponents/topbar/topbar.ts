import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { NotificationsService } from '../../../services/notifications';
import { NotificationDTO } from '../../../models/notification.model';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css']
})
export class TopbarComponent implements OnInit {

  @Input() today = new Date();
  @Input() searchTerm = '';
  @Input() sortBy = 'title';
  @Input() searchFocused = false;

  @Output() searchTermChange = new EventEmitter<string>();
  @Output() sortByChange = new EventEmitter<string>();
  @Output() searchFocusedChange = new EventEmitter<boolean>();

  notifications = signal<NotificationDTO[]>([]);
  showDropdown = signal(false);

  get userName(): string { return localStorage.getItem('userName') ?? ''; }
  get initials(): string {
    return this.userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';
  }

  constructor(private authService: AuthService, private notification: NotificationsService) {}

  logout() {
    this.authService.logout();
  }
  ngOnInit(){
    const userId = this.authService.getCurrentUserId();
    this.notification.getUnreadNotification(userId).subscribe({
      next : (data) => {
        this.notifications.set(data || []);
        },
      error : (error) => { console.error("Erreur lors du chargement des notifications ", error)}
      });

    }

  toggleDropdown() {
    this.showDropdown.set(!this.showDropdown());
  }

  markAsRead(notif: NotificationDTO) {
    this.notification.markedRead(notif.id!).subscribe({
      next: () => {
        this.notifications.set(this.notifications().filter(n => n.id !== notif.id));
      },
      error: (err) => console.error('Erreur markAsRead', err)
    });
  }
}
