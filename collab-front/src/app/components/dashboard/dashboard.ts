import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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

  // Utilisation de l'injection moderne
  private boardService = inject(BoardService);

  // État local avec Signals
  private boardsSignal = signal<BoardDTO[]>([]);


  searchTerm = '';
  sortBy = 'name';
  showModal = false;
  newBoard = { name: '', description: '' };
  nameError = false;


  filteredBoards = computed(() => {
    const term = this.searchTerm.toLowerCase();
    let list = this.boardsSignal().filter(b =>
      b.name.toLowerCase().includes(term) ||
      (b.description && b.description.toLowerCase().includes(term))
    );

    if (this.sortBy === 'name')     list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (this.sortBy === 'progress') list = [...list].sort((a, b) => (b.progress || 0) - (a.progress || 0));

    return list;
  });

  ngOnInit(): void {
    this.boardService.getBoardsByWorkspaceId(1).subscribe({
      next: (data) => this.boardsSignal.set(data),
      error: (err) => console.error("Erreur chargement boards :", err)
    });
  }


  toggleFav(id: number): void {
    this.boardService.toggleIsFavorite(id).subscribe({
      next: (updatedBoard) => {
        this.boardsSignal.update(boards =>
          boards.map(b => b.id === id ? updatedBoard : b)
        );
      }
    });
  }

  createBoard(): void {
    if (!this.newBoard.name.trim()) {
      this.nameError = true;
      return;
    }

    const dto: BoardDTO = {
      name: this.newBoard.name,
      description: this.newBoard.description
    } as BoardDTO;

    this.boardService.createBoard(dto).subscribe({
      next: (createdBoard) => {
        this.boardsSignal.update(boards => [...boards, createdBoard]);
        this.closeModal();
      }
    });
  }


  openModal(): void { this.showModal = true; }
  closeModal(): void { this.showModal = false; }
}
