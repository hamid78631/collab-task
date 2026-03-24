import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  @Output() openModal = new EventEmitter<void>();
  @Output() searchFocusedChange = new EventEmitter<boolean>();
}
