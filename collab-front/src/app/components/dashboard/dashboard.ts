import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BoardService } from '../../services/board'; 
import { BoardDTO } from '../../models/board.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  private boardService = inject(BoardService);
  private sanitizer = inject(DomSanitizer);

  private boardsSignal = signal<BoardDTO[]>([]);
  searchTerm = '';
  sortBy = 'name';
  viewMode: 'grid' | 'list' = 'grid';
  showModal = false;
  searchFocused = false;
  
  today = new Date();
  newBoard = { name: '', description: '' };
  nameError = false;

  totalBoards = computed(() => this.boardsSignal().length);
  completedTasks = 47; 
  lateTasks = 12;    
  activeMembers = 24;

  filteredBoards = computed(() => {
    const term = this.searchTerm.toLowerCase();
    let list = this.boardsSignal().filter(b =>
      b.name.toLowerCase().includes(term) ||
      (b.description && b.description.toLowerCase().includes(term))
    );

    if (this.sortBy === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (this.sortBy === 'progress') list = [...list].sort((a, b) => (b.progress || 0) - (a.progress || 0));

    return list;
  });

  ngOnInit(): void {
    this.boardService.getBoardsByWorkspaceId(1).subscribe({
      next: (data) => this.boardsSignal.set(data || []),
      error: (err) => console.error('Erreur chargement boards :', err)
    });
  }

  getIcon(boardId: number): SafeHtml {
    const icons = [
      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 11l3 3L22 4"/></svg>`
    ];
    const icon = icons[(boardId - 1) % icons.length] || icons[0];
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  toggleFav(id: number): void {
    this.boardService.toggleIsFavorite(id).subscribe({
      next: (updatedBoard: BoardDTO) => {
        this.boardsSignal.update(boards =>
          boards.map(b => b.id === id ? updatedBoard : b)
        );
      }
    });
  }

  createBoard(): void {
    if (!this.newBoard.name.trim()) { this.nameError = true; return; }
    const dto: BoardDTO = {
      id: 0,
      name: this.newBoard.name,
      description: this.newBoard.description,
      isFavorite: false,
      workspaceId: 1,
      progress: 0,
      tags: [],
      members: []
    };
    this.boardService.createBoard(dto).subscribe({
      next: (createdBoard) => {
        this.boardsSignal.update(boards => [...boards, createdBoard]);
        this.closeModal();
      }
    });
  }

  openModal(): void { this.showModal = true; }
  closeModal(): void { this.showModal = false; }
  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('mbackdrop')) this.closeModal();
  }
}