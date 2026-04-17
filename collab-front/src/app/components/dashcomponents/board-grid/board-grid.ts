import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { inject } from '@angular/core';
import { BoardDTO } from '../../../models/board.model';

@Component({
  selector: 'app-board-grid',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './board-grid.html',
  styleUrls: ['./board-grid.css']
})
export class BoardGridComponent {
  private sanitizer = inject(DomSanitizer);

  @Input() boards: BoardDTO[] = [];
  @Input() viewMode: 'grid' | 'list' = 'grid';

  @Output() viewModeChange = new EventEmitter<'grid' | 'list'>();
  @Output() toggleFav = new EventEmitter<number>();
  @Output() openEdit = new EventEmitter<BoardDTO>();
  @Output() openDelete = new EventEmitter<number>();

  getIcon(boardId: number): SafeHtml {
    const icons = [
      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 11l3 3L22 4"/></svg>`
    ];
    const icon = icons[(boardId - 1) % icons.length] || icons[0];
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }
}
