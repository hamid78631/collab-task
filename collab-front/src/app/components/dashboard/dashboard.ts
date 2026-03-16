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
  showEditModal = false;       // ← modale d'édition
  showDeleteConfirm = false;   // ← modale de confirmation suppression
  searchFocused = false;

  today = new Date();
  newBoard = { name: '', description: '' };
  nameError = false;

  // Board sélectionné pour édition ou suppression
  selectedBoard: BoardDTO | null = null;
  editBoard = { name: '', description: '', color: '' };
  editNameError = false;
  boardToDeleteId: number | null = null;

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

  // ─── ÉDITION ───────────────────────────────────────────────────────────────

  openEditModal(board: BoardDTO): void {
    this.selectedBoard = board;
    // Pré-remplissage du formulaire avec les valeurs actuelles du board
    this.editBoard = {
      name: board.name,
      description: board.description || '',
      color: board.color || ''
    };
    this.editNameError = false;
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedBoard = null;
    this.editBoard = { name: '', description: '', color: '' };
  }

  saveEditBoard(): void {
    if (!this.editBoard.name.trim()) { this.editNameError = true; return; }
    if (!this.selectedBoard) return;

    const updatedDto: BoardDTO = {
      ...this.selectedBoard,
      name: this.editBoard.name,
      description: this.editBoard.description,
      color: this.editBoard.color
    };

    this.boardService.updateBoard(this.selectedBoard.id, updatedDto).subscribe({
      next: (updated) => {
        // Remplacement du board modifié dans le signal
        this.boardsSignal.update(boards =>
          boards.map(b => b.id === updated.id ? updated : b)
        );
        this.closeEditModal();
      },
      error: (err) => console.error('Erreur mise à jour board :', err)
    });
  }

  // ─── COULEUR ───────────────────────────────────────────────────────────────

  updateColor(boardId: number, color: string): void {
    this.boardService.updateBoardColor(boardId, color).subscribe({
      next: (updated) => {
        // Mise à jour uniquement de la couleur dans le signal
        this.boardsSignal.update(boards =>
          boards.map(b => b.id === boardId ? updated : b)
        );
      },
      error: (err) => console.error('Erreur mise à jour couleur :', err)
    });
  }

  // ─── SUPPRESSION ───────────────────────────────────────────────────────────

  openDeleteConfirm(id: number): void {
    this.boardToDeleteId = id;
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.boardToDeleteId = null;
  }

  confirmDelete(): void {
    if (this.boardToDeleteId === null) return;
    const id = this.boardToDeleteId;

    this.boardService.deleteBoard(id).subscribe({
      next: () => {
        // Retrait du board supprimé du signal sans rechargement
        this.boardsSignal.update(boards => boards.filter(b => b.id !== id));
        this.closeDeleteConfirm();
      },
      error: (err) => console.error('Erreur suppression board :', err)
    });
  }

  // ─── MODALES CRÉATION ──────────────────────────────────────────────────────

  openModal(): void { this.showModal = true; }

  closeModal(): void {
    this.showModal = false;
    this.newBoard = { name: '', description: '' };
    this.nameError = false;
  }

  onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('mbackdrop')) this.closeModal();
    if (target.classList.contains('mbackdrop-edit')) this.closeEditModal();
    if (target.classList.contains('mbackdrop-delete')) this.closeDeleteConfirm();
  }
}
