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
  sortBy = 'title';
  viewMode: 'grid' | 'list' = 'grid';
  showModal = false;
  showEditModal = false;
  showDeleteConfirm = false;
  searchFocused = false;

  today = new Date();
  newBoard = { title: '', backgroundColor: '' };
  nameError = false;

  selectedBoard: BoardDTO | null = null;
  editBoard = { title: '', backgroundColor: '' };
  editNameError = false;
  boardToDeleteId: number | null = null;

  totalBoards = computed(() => this.boardsSignal().length);
  completedTasks = 47;
  lateTasks = 12;
  activeMembers = 24;


  filteredBoards = computed(() => {
    const term = this.searchTerm.toLowerCase();
    let list = this.boardsSignal().filter(b =>
      b.title.toLowerCase().includes(term)
    );
    if (this.sortBy === 'title') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
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
    if (!this.newBoard.title.trim()) { this.nameError = true; return; }
    const dto: BoardDTO = {
      id: 0,
      title: this.newBoard.title,
      backgroundColor: this.newBoard.backgroundColor,
      isFavorite: false,
      workspaceId: 1
    };
    this.boardService.createBoard(dto).subscribe({
      next: (createdBoard) => {
        this.boardsSignal.update(boards => [...boards, createdBoard]);
        this.closeModal();
      },
      error: (err) => alert('Erreur création board :', err)
    });
  }

  // ─── ÉDITION ───────────────────────────────────────────────────────────────

  openEditModal(board: BoardDTO): void {
    this.selectedBoard = board;
    this.editBoard = {
      title: board.title,
      backgroundColor: board.backgroundColor || ''
    };
    this.editNameError = false;
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedBoard = null;
    this.editBoard = { title: '', backgroundColor: '' };
  }

  saveEditBoard(): void {
    if (!this.editBoard.title.trim()) { this.editNameError = true; return; }
    if (!this.selectedBoard) return;

    const updatedDto: BoardDTO = {
      ...this.selectedBoard,
      title: this.editBoard.title,
      backgroundColor: this.editBoard.backgroundColor
    };

    this.boardService.updateBoard(this.selectedBoard.id, updatedDto).subscribe({
      next: (updated) => {
        this.boardsSignal.update(boards =>
          boards.map(b => b.id === updated.id ? updated : b)
        );
        this.closeEditModal();
      },
      error: (err) => console.error('Erreur mise à jour board :', err)
    });
  }


  updateColor(boardId: number, color: string): void {
    this.boardService.updateBoardColor(boardId, color).subscribe({
      next: (updated) => {
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
        this.boardsSignal.update(boards => boards.filter(b => b.id !== id));
        this.closeDeleteConfirm();
      },
      error: (err) => console.error('Erreur suppression board :', err)
    });
  }

  // ─── MODALES ───────────────────────────────────────────────────────────────

  openModal(): void { this.showModal = true; }

  closeModal(): void {
    this.showModal = false;
    this.newBoard = { title: '', backgroundColor: '' };
    this.nameError = false;
  }

  onBackdropClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('mbackdrop')) this.closeModal();
    if (target.classList.contains('mbackdrop-edit')) this.closeEditModal();
    if (target.classList.contains('mbackdrop-delete')) this.closeDeleteConfirm();
  }
}
