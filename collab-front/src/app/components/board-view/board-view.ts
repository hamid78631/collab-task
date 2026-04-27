import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BoardService } from '../../services/board';
import { TaskColumnService } from '../../services/task-column';
import { TaskService } from '../../services/task';
import { CommentService } from '../../services/comment';
import { AuthService } from '../../services/auth';
import { NotificationsService } from '../../services/notifications';
import { BoardDTO } from '../../models/board.model';
import { TaskColumnDTO } from '../../models/taskColumn.model';
import { TaskDTO } from '../../models/task.model';
import { CommentDTO } from '../../models/comment.model';
import { NotificationDTO } from '../../models/notification.model';
import { WorkspaceService } from '../../services/workspace';
import { UserDTO } from '../../models/user.model';

@Component({
  selector: 'app-board-view',
  imports: [RouterLink, FormsModule],
  templateUrl: './board-view.html',
  styleUrl: './board-view.css',
})
export class BoardView implements OnInit {

  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);
  private columnService = inject(TaskColumnService);
  private taskService = inject(TaskService);
  private commentService = inject(CommentService);
  private authService = inject(AuthService);
  private notificationsService = inject(NotificationsService);
  private workspaceService = inject(WorkspaceService);

  members = signal<UserDTO[]>([]);
  board = signal<BoardDTO | null>(null);
  columns = signal<TaskColumnDTO[]>([]);
  tasksByColumn = signal<Map<number, TaskDTO[]>>(new Map());

  // Ajout de colonne
  showAddColumn = signal(false);
  newColumnName = signal('');

  // Renommer colonne (double-clic)
  editingColumnId = signal<number | null>(null);
  editingColumnName = signal('');

  // Ajout de tâche
  addingTaskColumnId = signal<number | null>(null);
  newTaskTitle = signal('');

  // Drag & drop
  draggedTaskId = signal<number | null>(null);
  dragSourceColumnId = signal<number | null>(null);
  dragOverColumnId = signal<number | null>(null);

  // Notifications
  notifications = signal<NotificationDTO[]>([]);
  showNotifDropdown = signal(false);

  // Modal détail tâche
  selectedTask = signal<TaskDTO | null>(null);
  taskComments = signal<CommentDTO[]>([]);
  modalTitle = signal('');
  modalDesc = signal('');
  modalPriority = signal<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  newCommentContent = signal('');
  modalDirty = signal(false);

readonly memberColors = [
    '#4F46E5', '#0891B2', '#16A34A',
    '#DB2777', '#D97706', '#7C3AED'
  ];

  ngOnInit() {
    const userId = this.authService.getCurrentUserId();
    this.notificationsService.getUnreadNotification(userId).subscribe({
      next: (data) => this.notifications.set(data || []),
      error: (err) => console.error('Erreur notifications', err)
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.boardService.getBoard(id).subscribe({
      next: (board) => {
        this.board.set(board);
        this.workspaceService.getWorkspaceMembers(board.workspaceId).subscribe({
          next : (members ) => this.members.set(members || []),
          error : (err) => console.error('Erreur membres' , err)
          })
        },
      error: (err) => console.error('Erreur chargement board', err)
    });

    this.columnService.getAllTaskColumnsByBoardId(id).subscribe({
      next: (cols) => {
        this.columns.set(cols || []);
        cols.forEach(col => this.loadTasks(col.id!));
      },
      error: (err) => console.error('Erreur chargement colonnes', err)
    });
  }

  private loadTasks(columnId: number) {
    this.taskService.getAllTasksByTaskColumnId(columnId).subscribe({
      next: (tasks) => {
        const map = new Map(this.tasksByColumn());
        map.set(columnId, tasks || []);
        this.tasksByColumn.set(map);
      },
      error: (err) => console.error(`Erreur chargement tâches colonne ${columnId}`, err)
    });
  }

  // ── Notifications ─────────────────────────────────────────────────

  toggleNotifDropdown() {
    this.showNotifDropdown.set(!this.showNotifDropdown());
  }

  markNotifAsRead(notif: NotificationDTO) {
    this.notificationsService.markedRead(notif.id!).subscribe({
      next: () => this.notifications.set(this.notifications().filter(n => n.id !== notif.id)),
      error: (err) => console.error('Erreur markAsRead', err)
    });
  }

  // ── Colonnes ──────────────────────────────────────────────────────

  addColumn() {
    const name = this.newColumnName().trim();
    if (!name || !this.board()) return;

    const col: TaskColumnDTO = { name, position: this.columns().length, boardId: this.board()!.id };
    this.columnService.createTaskColumn(col).subscribe({
      next: (created) => {
        this.columns.set([...this.columns(), created]);
        const map = new Map(this.tasksByColumn());
        map.set(created.id!, []);
        this.tasksByColumn.set(map);
        this.newColumnName.set('');
        this.showAddColumn.set(false);
      },
      error: (err) => console.error('Erreur création colonne', err)
    });
  }

  startRenameColumn(col: TaskColumnDTO) {
    this.editingColumnId.set(col.id ?? null);
    this.editingColumnName.set(col.name);
  }

  saveRenameColumn(col: TaskColumnDTO) {
    const name = this.editingColumnName().trim();
    if (!name) { this.cancelRenameColumn(); return; }
    this.columnService.updateTaskColumn(col.id!, { ...col, name }).subscribe({
      next: (updated) => {
        this.columns.set(this.columns().map(c => c.id === updated.id ? updated : c));
        this.editingColumnId.set(null);
      },
      error: (err) => console.error('Erreur renommage colonne', err)
    });
  }

  cancelRenameColumn() {
    this.editingColumnId.set(null);
  }

  deleteColumn(colId: number) {
    this.columnService.deleteTaskColumn(colId).subscribe({
      next: () => {
        this.columns.set(this.columns().filter(c => c.id !== colId));
        const map = new Map(this.tasksByColumn());
        map.delete(colId);
        this.tasksByColumn.set(map);
      },
      error: (err) => console.error('Erreur suppression colonne', err)
    });
  }

  // ── Tâches ────────────────────────────────────────────────────────

  startAddTask(colId: number) {
    this.addingTaskColumnId.set(colId);
    this.newTaskTitle.set('');
  }

  addTask(colId: number) {
    const title = this.newTaskTitle().trim();
    if (!title) return;
    const task: TaskDTO = { title, description: '', priority: 'MEDIUM', taskColumnId: colId };
    this.taskService.createTask(task).subscribe({
      next: (created) => {
        const map = new Map(this.tasksByColumn());
        map.set(colId, [...(map.get(colId) ?? []), created]);
        this.tasksByColumn.set(map);
        this.addingTaskColumnId.set(null);

        const userId = this.authService.getCurrentUserId();
        const boardTitle = this.board()?.title ?? '';
        const boardId = this.board()?.id;
        this.notificationsService.createNotification(
          userId,
          `Tâche "${title}" ajoutée dans le board "${boardTitle}"`,
          'TASK_CREATED',
          created.id,
          boardId
        ).subscribe({ error: (err) => console.error('Erreur notification', err) });
      },
      error: (err) => console.error('Erreur création tâche', err)
    });
  }

  cancelAddTask() {
    this.addingTaskColumnId.set(null);
  }

  deleteTask(taskId: number, colId: number, event: MouseEvent) {
    event.stopPropagation();
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        const map = new Map(this.tasksByColumn());
        map.set(colId, (map.get(colId) ?? []).filter(t => t.id !== taskId));
        this.tasksByColumn.set(map);
      },
      error: (err) => console.error('Erreur suppression tâche', err)
    });
  }

  // ── Drag & drop ───────────────────────────────────────────────────

  onDragStart(taskId: number, colId: number, event: DragEvent) {
    this.draggedTaskId.set(taskId);
    this.dragSourceColumnId.set(colId);
    event.dataTransfer?.setData('text/plain', String(taskId));
  }

  onDragOver(colId: number, event: DragEvent) {
    event.preventDefault();
    this.dragOverColumnId.set(colId);
  }

  onDragLeave(event: DragEvent) {
    const target = event.currentTarget as HTMLElement;
    if (!target.contains(event.relatedTarget as Node)) {
      this.dragOverColumnId.set(null);
    }
  }

  onDrop(targetColId: number, event: DragEvent) {
    event.preventDefault();
    const taskId = this.draggedTaskId();
    const sourceColId = this.dragSourceColumnId();
    if (!taskId || sourceColId === targetColId) { this.resetDrag(); return; }
    this.taskService.moveTask(taskId, targetColId).subscribe({
      next: () => {
        const map = new Map(this.tasksByColumn());
        const task = (map.get(sourceColId!) ?? []).find(t => t.id === taskId);
        if (!task) { this.resetDrag(); return; }
        map.set(sourceColId!, (map.get(sourceColId!) ?? []).filter(t => t.id !== taskId));
        map.set(targetColId, [...(map.get(targetColId) ?? []), { ...task, taskColumnId: targetColId }]);
        this.tasksByColumn.set(map);
        this.resetDrag();
      },
      error: (err) => { console.error('Erreur déplacement tâche', err); this.resetDrag(); }
    });
  }

  onDragEnd() {
    this.resetDrag();
  }

  private resetDrag() {
    this.draggedTaskId.set(null);
    this.dragSourceColumnId.set(null);
    this.dragOverColumnId.set(null);
  }

  // ── Modal détail tâche ────────────────────────────────────────────

  openTaskModal(task: TaskDTO) {
    this.selectedTask.set(task);
    this.modalTitle.set(task.title);
    this.modalDesc.set(task.description);
    this.modalPriority.set(task.priority);
    this.newCommentContent.set('');
    this.modalDirty.set(false);
    this.taskComments.set([]);
    this.commentService.getCommentsByTask(task.id!).subscribe({
      next: (comments) => this.taskComments.set(comments || []),
      error: () => this.taskComments.set([])
    });
  }

  saveTaskModal() {
    const task = this.selectedTask();
    if (!task || !this.modalTitle().trim()) return;
    const updated: TaskDTO = {
      ...task,
      title: this.modalTitle().trim(),
      description: this.modalDesc(),
      priority: this.modalPriority()
    };
    this.taskService.updateTask(task.id!, updated).subscribe({
      next: (result) => {
        this.replaceTask(result);
        this.selectedTask.set(result);
        this.modalDirty.set(false);
      },
      error: (err) => console.error('Erreur mise à jour tâche', err)
    });
  }

  closeTaskModal() {
    this.selectedTask.set(null);
    this.taskComments.set([]);
    this.modalDirty.set(false);
  }

  addComment() {
    const content = this.newCommentContent().trim();
    if (!content) return;
    const comment: CommentDTO = { content, taskId: this.selectedTask()!.id!, authorId: this.authService.getCurrentUserId() };
    this.commentService.createComment(comment).subscribe({
      next: (created) => {
        this.taskComments.set([...this.taskComments(), created]);
        this.newCommentContent.set('');
      },
      error: (err) => console.error('Erreur ajout commentaire', err)
    });
  }

  deleteComment(commentId: number) {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.taskComments.set(this.taskComments().filter(c => c.id !== commentId));
      },
      error: (err) => console.error('Erreur suppression commentaire', err)
    });
  }

  // ── Utilitaires ───────────────────────────────────────────────────

  private replaceTask(updated: TaskDTO) {
    const map = new Map(this.tasksByColumn());
    map.forEach((tasks, colId) => {
      if (tasks.some(t => t.id === updated.id)) {
        map.set(colId, tasks.map(t => t.id === updated.id ? updated : t));
      }
    });
    this.tasksByColumn.set(map);
  }

  getColumnTasks(colId: number): TaskDTO[] {
    return this.tasksByColumn().get(colId) ?? [];
  }

  priorityLabel(p: string): string {
    return p === 'HIGH' ? 'Haute' : p === 'MEDIUM' ? 'Moyenne' : 'Basse';
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  // Couleur dérivée de la position de la colonne dans le board
  private readonly COLUMN_COLORS = [
    '#4F46E5', '#0891B2', '#16A34A', '#D97706', '#DC2626', '#7C3AED', '#DB2777', '#0D9488'
  ];

  getColumnColor(colId: number): string {
    const idx = this.columns().findIndex(c => c.id === colId);
    return this.COLUMN_COLORS[idx % this.COLUMN_COLORS.length] ?? '#4F46E5';
  }

  // Détecte si une colonne représente un état "terminé" d'après son nom
  isDoneColumn(colName: string): boolean {
    const n = colName.toLowerCase();
    return n.includes('terminé') || n.includes('done') || n.includes('fini')
        || n.includes('completed') || n.includes('fermé') || n.includes('closed');
  }

  // Couleur de la colonne qui contient la tâche sélectionnée
  selectedTaskColumnColor(): string {
    const colId = this.selectedTask()?.taskColumnId;
    if (!colId) return '#4F46E5';
    return this.getColumnColor(colId);
  }

  // Couleur d'avatar pour un assignee (basée sur l'id)
  getAssigneeColor(assigneeId: number): string {
    const colors = ['#4F46E5', '#0891B2', '#16A34A', '#D97706', '#DC2626', '#7C3AED'];
    return colors[assigneeId % colors.length];
  }
 getMemberByAssigneeId(assigneeId: number): UserDTO | undefined {
    return this.members().find(m => m.id === assigneeId);
  }

  // récupérer la couleur du membre
  getMemberColor(index : number) : string {
    return this.membersColors[index % this.memberColors.length] ;
    }
}
