import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css']
})
export class TopbarComponent {

  @Input() today = new Date();
  @Input() searchTerm = '';
  @Input() sortBy = 'title';
  @Input() searchFocused = false;

  @Output() searchTermChange = new EventEmitter<string>();
  @Output() sortByChange = new EventEmitter<string>();
  @Output() searchFocusedChange = new EventEmitter<boolean>();

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
