import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BoardService } from '../../services/board';
import { WorkspaceService } from '../../services/workspace';
import { AuthService } from '../../services/auth';
import { NotificationsService } from '../../services/notifications';
import { BoardDTO } from '../../models/board.model';
import { WorkspaceDTO } from '../../models/workspace.model';
import { NotificationDTO } from '../../models/notification.model';
import { UserDTO } from '../../models/user.model';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-boards-page',
  imports: [RouterLink, FormsModule, DatePipe],
  templateUrl: './boards-page.html',
  styleUrl: './boards-page.css',
})
export class BoardsPageComponent implements OnInit {

  private boardService = inject(BoardService);
  private workspaceService = inject(WorkspaceService);
  private authService = inject(AuthService);
  private notificationsService = inject(NotificationsService);

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

  // Filtre favoris
  showFavoritesOnly = signal(false);

  // Notifications
  notifications = signal<NotificationDTO[]>([]);
  showNotifDropdown = signal(false);
 //Modal de création de
  showWorkspaceModal = signal(false);
  newWorkspaceName = signal('');
  newWorkspaceNameError = signal(false);
  readonly colorPalette = [
    '#4F46E5', '#7C3AED', '#DB2777', '#DC2626',
    '#D97706', '#059669', '#0891B2', '#1D4ED8'
  ];


//modal members
showMembersModal = signal(false);
membersWorkspaceId = signal<number | null>(null);
members = signal<UserDTO[]>([]);

memberSearchQuery = signal('');
memberSearchResults = signal<UserDTO[]>([]);

  private userService = inject(UserService);

  ngOnInit() {
    this.loadWorkspaces();
    this.notificationsService.getUnreadNotification(this.authService.getCurrentUserId()).subscribe({
      next: (data) => this.notifications.set(data || []),
      error: (err) => console.error('Erreur notifications', err)
    });
  }

  private loadWorkspaces() {
    this.workspaceService.getWorkspacesByUser(this.authService.getCurrentUserId()).subscribe({
      next: (workspaces) => {
        this.workspaces.set(workspaces || []);
        workspaces.forEach(ws => {this.boardService.getBoardsByWorkspaceId(ws.id).subscribe({
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

  // ── Notifications ─────────────────────────────────────────────────

  toggleNotifDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.showNotifDropdown.set(!this.showNotifDropdown());
  }

  markNotifAsRead(notif: NotificationDTO) {
    this.notificationsService.markedRead(notif.id!).subscribe({
      next: () => this.notifications.set(this.notifications().filter(n => n.id !== notif.id)),
      error: (err) => console.error('Erreur markAsRead', err)
    });
  }

  //  Favori
  toggleFavorite(boardId: number, event: MouseEvent) {
    event.stopPropagation();
    this.boardService.toggleIsFavorite(boardId).subscribe({
      next: (updated) => this.replaceBoard(updated)
    });
  }
 //creer un workspace


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

  openCreateModalFromTopbar() {
    const firstWs = this.workspaces()[0];
    if (firstWs) this.openCreateModal(firstWs.id);
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

  getVisibleBoards(wsId: number): BoardDTO[] {
    const boards = this.boardsByWorkspace().get(wsId) ?? [];
    return this.showFavoritesOnly() ? boards.filter(b => b.isFavorite) : boards;
  }

  hasVisibleBoards(wsId: number): boolean {
    return this.getVisibleBoards(wsId).length > 0;
  }

  openWorkspaceModal() {
    this.newWorkspaceName.set('');
    this.newWorkspaceNameError.set(false);
    this.showWorkspaceModal.set(true);
  }

  closeWorkspaceModal() {
    this.showWorkspaceModal.set(false);
  }

  saveWorkspace() {
    const name = this.newWorkspaceName().trim();
    if (!name) {
      this.newWorkspaceNameError.set(true);
      return;
    }

    const dto: WorkspaceDTO = {
      id: 0,
      name,
      ownerId: this.authService.getCurrentUserId()
    };

    this.workspaceService.createWorkspace(dto).subscribe({
      next: (created) => {
        this.workspaces.update(list => [...list, created]);
        this.boardsByWorkspace.update(map => {
          const newMap = new Map(map);
          newMap.set(created.id, []);
          return newMap;
        });
        this.closeWorkspaceModal();
      },
      error: (err) => console.error('Erreur création workspace', err)
    });
  }

  openMembersModal(wsId: number) {
    this.membersWorkspaceId.set(wsId);
    this.members.set([]);
    this.memberSearchQuery.set('');
    this.memberSearchResults.set([]);
    this.showMembersModal.set(true);
    this.workspaceService.getWorkspaceMembers(wsId).subscribe({
      next: (data) => this.members.set(data || []),
      error: (err) => console.error('Erreur chargement membres', err)
    });
  }

  closeMembersModal() {
    this.showMembersModal.set(false);
    this.membersWorkspaceId.set(null);
  }

  onMemberSearch(query: string) {
    this.memberSearchQuery.set(query);
    if (!query.trim()) {
      this.memberSearchResults.set([]);
      return;
    }
    this.userService.searchUser(query, query).subscribe({
      next: (users) => {
        const memberIds = new Set(this.members().map(m => m.id));
        this.memberSearchResults.set((users || []).filter(u => !memberIds.has(u.id)));
      },
      error: (err) => console.error('Erreur recherche utilisateurs', err)
    });
  }

  addMember(userId: number) {
    const wsId = this.membersWorkspaceId()!;
    this.workspaceService.addMemberToWorkspace(wsId, userId).subscribe({
      next: () => {
        const user = this.memberSearchResults().find(u => u.id === userId);
        if (user) {
          this.members.update(list => [...list, user]);
          this.memberSearchResults.update(list => list.filter(u => u.id !== userId));
        }
      },
      error: (err) => console.error('Erreur ajout membre', err)
    });
  }

  removeMember(userId: number) {
    const wsId = this.membersWorkspaceId()!;
    this.workspaceService.removeMemberFromWorkspace(wsId, userId).subscribe({
      next: () => this.members.update(list => list.filter(m => m.id !== userId)),
      error: (err) => console.error('Erreur retrait membre', err)
    });
  }
}
