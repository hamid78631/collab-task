import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BoardService } from '../../services/board';
import { WorkspaceService } from '../../services/workspace';
import { AuthService } from '../../services/auth';
import { BoardDTO } from '../../models/board.model';
import { WorkspaceDTO } from '../../models/workspace.model';

@Component({
  selector: 'app-boards-page',
  imports: [RouterLink, FormsModule],
  templateUrl: './boards-page.html',
  styleUrl: './boards-page.css',
})
export class BoardsPageComponent implements OnInit {

  private boardService = inject(BoardService);
  private workspaceService = inject(WorkspaceService);
  private authService = inject(AuthService);

  workspaces = signal<WorkspaceDTO[]>([]);
  boardsByWorkspace = signal<Map<number, BoardDTO[]>>(new Map());

  // Menu contextuel par carte
  activeMenuBoardId = signal<number | null>(null);

  // Modal créer / renommer
  showBoardModal = signal(false);
  modalMode = signal<'create' | 'edit'>('create');
  modalWorkspaceId = signal<number | null>(null);
  modalBoardId = signal<number | null>(null);
  modalTitle = signal('');
  modalColor = signal('#4F46E5');

  // Confirmation de suppression
  confirmDeleteBoardId = signal<number | null>(null);

  readonly colorPalette = [
    '#4F46E5', '#7C3AED', '#DB2777', '#DC2626',
    '#D97706', '#059669', '#0891B2', '#1D4ED8'
  ];

  ngOnInit() {
    this.loadWorkspaces();
  }

  private loadWorkspaces() {
    this.workspaceService.getWorkspacesByUser(this.authService.getCurrentUserId()).subscribe({
      next: (workspaces) => {
        this.workspaces.set(workspaces || []);
        workspaces.forEach(ws => {
                                                    this.boardService.getBoardsByWorkspaceId(ws.id).subscribe({
                                                      next: (boards) => {
                                                        const map = new Map(this.boardsByWorkspace());
                                                        map.set(ws.id, boards || []);
              this.boardsByWorkspace.set(map);
            },
            error: (err) => console.error(`Erreur boards workspace ${ws.id}`, err)
          });
        });
      },
      error: (err) => console.error('Erreur de chargement des workspaces', err)
    });
  }

  //  Favori
  toggleFavorite(boardId: number, event: MouseEvent) {
    event.stopPropagation();
    this.boardService.toggleIsFavorite(boardId).subscribe({
      next: (updated) => this.replaceBoard(updated)
    });
  }

  //Menu contextuel
  openMenu(boardId: number, event: MouseEvent) {
    event.stopPropagation();
    this.activeMenuBoardId.set(
      this.activeMenuBoardId() === boardId ? null : boardId
    );
  }

  closeMenu() {
    this.activeMenuBoardId.set(null);
  }

  //  Créer un board
  openCreateModal(wsId: number) {
    this.modalMode.set('create');
    this.modalWorkspaceId.set(wsId);
    this.modalBoardId.set(null);
    this.modalTitle.set('');
    this.modalColor.set('#4F46E5');
    this.showBoardModal.set(true);
  }

  // ── Renommer un board ─────────────────────────────────────────────
  openEditModal(board: BoardDTO, event: MouseEvent) {
    event.stopPropagation();
    this.closeMenu();
    this.modalMode.set('edit');
    this.modalBoardId.set(board.id);
    this.modalTitle.set(board.title);
    this.modalColor.set(board.backgroundColor || '#4F46E5');
    this.showBoardModal.set(true);
  }

  // ── Sauvegarder (créer ou renommer)
  saveBoardModal() {
    const title = this.modalTitle().trim();
    if (!title) return;

    if (this.modalMode() === 'create') {
      const wsId = this.modalWorkspaceId()!;
      const newBoard: BoardDTO = {
        id: 0,
        title,
        backgroundColor: this.modalColor(),
        isFavorite: false,
        workspaceId: wsId
      };
      this.boardService.createBoard(newBoard).subscribe({
        next: (created) => {
          const map = new Map(this.boardsByWorkspace());
          map.set(wsId, [...(map.get(wsId) ?? []), created]);
          this.boardsByWorkspace.set(map);
          this.closeBoardModal();
        },
        error: (err) => console.error('Erreur création board', err)
      });
    } else {
      const boardId = this.modalBoardId()!;
      let existingBoard: BoardDTO | undefined;
      this.boardsByWorkspace().forEach(boards => {
        const found = boards.find(b => b.id === boardId);
        if (found) existingBoard = found;
      });
      if (!existingBoard) return;

      const updated: BoardDTO = { ...existingBoard, title, backgroundColor: this.modalColor() };
      this.boardService.updateBoard(boardId, updated).subscribe({
        next: (result) => {
          this.replaceBoard(result);
          this.closeBoardModal();
        },
        error: (err) => console.error('Erreur mise à jour board', err)
      });
    }
  }

  closeBoardModal() {
    this.showBoardModal.set(false);
  }

  // ── Changer la couleur
  changeColor(board: BoardDTO, color: string, event: MouseEvent) {
    event.stopPropagation();
    this.boardService.updateBoardColor(board.id, color).subscribe({
      next: (updated) => {
        this.replaceBoard(updated);
        this.closeMenu();
      },
      error: (err) => console.error('Erreur changement couleur', err)
    });
  }

  //  Supprimer
  askDeleteBoard(boardId: number, event: MouseEvent) {
    event.stopPropagation();
    this.closeMenu();
    this.confirmDeleteBoardId.set(boardId);
  }

  confirmDelete() {
    const boardId = this.confirmDeleteBoardId()!;
    this.boardService.deleteBoard(boardId).subscribe({
      next: () => {
        const map = new Map(this.boardsByWorkspace());
        map.forEach((boards, wsId) => {
          map.set(wsId, boards.filter(b => b.id !== boardId));
        });
        this.boardsByWorkspace.set(map);
        this.confirmDeleteBoardId.set(null);
      },
      error: (err) => console.error('Erreur suppression board', err)
    });
  }

  cancelDelete() {
    this.confirmDeleteBoardId.set(null);
  }

  // ── UtilitairesE
  private replaceBoard(updated: BoardDTO) {
    const map = new Map(this.boardsByWorkspace());
    map.forEach((boards, wsId) => {
      map.set(wsId, boards.map(b => b.id === updated.id ? updated : b));
    });
    this.boardsByWorkspace.set(map);
  }

  getBoardCount(wsId: number): number {
    return (this.boardsByWorkspace().get(wsId) ?? []).length;
  }
}
