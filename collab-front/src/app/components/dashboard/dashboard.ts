import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BoardService } from '../../services/board';
import { BoardDTO } from '../../models/board.model';
import { SidebarComponent } from '../dashcomponents/sidebar/sidebar';
import { TopbarComponent } from '../dashcomponents/topbar/topbar';
import { StatsCardsComponent } from '../dashcomponents/stats-cards/stats-cards';
import { BoardGridComponent } from '../dashcomponents/board-grid/board-grid';
import { BoardModalsComponent } from '../dashcomponents/board-modals/board-modals';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    TopbarComponent,
    StatsCardsComponent,
    BoardGridComponent,
    BoardModalsComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  private boardService = inject(BoardService);
  private boardsSignal = signal<BoardDTO[]>([]);

  searchTerm = '';
  sortBy = 'title';
  viewMode: 'grid' | 'list' = 'grid';
  searchFocused = false;
  today = new Date();

  showEditModal = false;
  showDeleteConfirm = false;
  editNameError = false;
  editBoard = { title: '', backgroundColor: '' };

  selectedBoard: BoardDTO | null = null;
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
    const workspaceId = Number(localStorage.getItem('workspaceId'));
    if (!workspaceId) return;
    this.boardService.getBoardsByWorkspaceId(workspaceId).subscribe({
      next: (data) => this.boardsSignal.set(data || []),
      error: (err) => console.error('Erreur chargement boards :', err)
    });
  }

  toggleFav(id: number): void {
    this.boardService.toggleIsFavorite(id).subscribe({
      next: (updated) => this.boardsSignal.update(boards =>
        boards.map(b => b.id === id ? updated : b)
      )
    });
  }

  openEditModal(board: BoardDTO): void {
    this.selectedBoard = board;
    this.editBoard = { title: board.title, backgroundColor: board.backgroundColor || '' };
    this.editNameError = false;
    this.showEditModal = true;
  }

  saveEditBoard(): void {
    if (!this.editBoard.title.trim()) { this.editNameError = true; return; }
    if (!this.selectedBoard) return;
    this.boardService.updateBoard(this.selectedBoard.id, {
      ...this.selectedBoard, ...this.editBoard
    }).subscribe({
      next: (updated) => {
        this.boardsSignal.update(boards => boards.map(b => b.id === updated.id ? updated : b));
        this.closeEditModal();
      }
    });
  }

  openDeleteConfirm(id: number): void {
    this.boardToDeleteId = id;
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    if (this.boardToDeleteId === null) return;
    const id = this.boardToDeleteId;
    this.boardService.deleteBoard(id).subscribe({
      next: () => {
        this.boardsSignal.update(boards => boards.filter(b => b.id !== id));
        this.closeDeleteConfirm();
      }
    });
  }

  closeEditModal(): void { this.showEditModal = false; this.selectedBoard = null; this.editBoard = { title: '', backgroundColor: '' }; }
  closeDeleteConfirm(): void { this.showDeleteConfirm = false; this.boardToDeleteId = null; }
}
