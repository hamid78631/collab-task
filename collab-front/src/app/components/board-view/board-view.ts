import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BoardService } from '../../services/board';
import { TaskColumnService } from '../../services/task-column';
import { TaskService } from '../../services/task';
import { CommentService } from '../../services/comment';
import { BoardDTO } from '../../models/board.model';
import { TaskColumnDTO } from '../../models/taskColumn.model';
import { TaskDTO } from '../../models/task.model';
import { CommentDTO } from '../../models/comment.model';

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

  // Modal détail tâche
  selectedTask = signal<TaskDTO | null>(null);
  taskComments = signal<CommentDTO[]>([]);
  modalTitle = signal('');
  modalDesc = signal('');
  modalPriority = signal<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  newCommentContent = signal('');
  modalDirty = signal(false);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.boardService.getBoard(id).subscribe({
      next: (board) => this.board.set(board),
      error: (err) => console.error('Erreur chargement board', err)
    });
    this.columnService.getAllTaskColumnsByBoardId(id).subscribe({
      next: (cols) => {
        this.columns.set(cols || []);
        cols.forEach(col => this.loadTasks(col.id));
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

  // ── Colonnes ──────────────────────────────────────────────────────

  addColumn() {
    const name = this.newColumnName().trim();
    if (!name) return;
    const col: TaskColumnDTO = { id: 0, name, position: this.columns().length, boardId: this.board()!.id };
    this.columnService.createTaskColumn(col).subscribe({
      next: (created) => {
        this.columns.set([...this.columns(), created]);
        const map = new Map(this.tasksByColumn());
        map.set(created.id, []);
        this.tasksByColumn.set(map);
        this.newColumnName.set('');
        this.showAddColumn.set(false);
      },
      error: (err) => console.error('Erreur création colonne', err)
    });
  }

  startRenameColumn(col: TaskColumnDTO) {
    this.editingColumnId.set(col.id);
    this.editingColumnName.set(col.name);
  }

  saveRenameColumn(col: TaskColumnDTO) {
    const name = this.editingColumnName().trim();
    if (!name) { this.cancelRenameColumn(); return; }
    this.columnService.updateTaskColumn(col.id, { ...col, name }).subscribe({
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
    const comment: CommentDTO = { content, taskId: this.selectedTask()!.id!, authorId: 1 };
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
}