import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task';
import { AuthService } from '../../services/auth';
import { CommentService } from '../../services/comment';
import { NotificationsService } from '../../services/notifications';
import { LabelService } from '../../services/label';
import { TaskDTO } from '../../models/task.model';
import { CommentDTO } from '../../models/comment.model';
import { LabelDTO } from '../../models/label.model';

@Component({
  selector: 'app-tasks-page',
  imports: [FormsModule, DatePipe, RouterLink],
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.css',
})
export class TaskPageComponent implements OnInit {

  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private commentService = inject(CommentService);
  private notificationsService = inject(NotificationsService);
  private labelService = inject(LabelService);

  tasks = signal<TaskDTO[]>([]);
  filteredTasks = signal<TaskDTO[]>([]);
  selectedPriority = signal<string>('ALL');

  userId = this.authService.getCurrentUserId();
  currentUserInitial = (this.authService.getCurrentUserName() || 'U')[0].toUpperCase();

  showDetailModal = signal<boolean>(false);
  selectedTask = signal<TaskDTO | null>(null);
  taskComments = signal<CommentDTO[]>([]);
  newCommentContent = signal<string>('');
  workspaceLabels = signal<LabelDTO[]>([]);
  showLabelPicker = signal<boolean>(false);
  newLabelName = signal<string>('');
  newLabelColor = signal<string>('#6366f1');

  newTitle = signal<string>("");
  newDescription = signal<string>("");
  newPriority = signal<'HIGH' | 'LOW' | 'MEDIUM'>('LOW');
  newDueDate = signal<string>('');

  ngOnInit() {
    this.taskService.getAllTasksByAssigneeId(this.userId).subscribe({
      next: (data) => {
        this.tasks.set(data || []);
        this.filteredTasks.set(data || []);
      },
      error: (error) => {
        console.error("Une erreur s'est produite lors du chargement !", error);
      }
    });
  }

 applyFilter() {
    let result = this.tasks();

    if (this.selectedPriority() !== 'ALL') {
      result = result.filter(t => t.priority === this.selectedPriority());
    }
    this.filteredTasks.set(result);
  }



//Modifier la priorité
  setPriority(priority: string){

   this.selectedPriority.set(priority) ;
   this.applyFilter();
    }

  openDetailModal(task: TaskDTO) {
    this.selectedTask.set(task);
    this.newTitle.set(task.title);
    this.newDescription.set(task.description);
    this.newPriority.set(task.priority);
    this.newDueDate.set(task.dueDate || '');
    this.newCommentContent.set('');
    this.taskComments.set([]);
    this.commentService.getCommentsByTask(task.id!).subscribe({
      next: (comments) => this.taskComments.set(comments || []),
      error: () => this.taskComments.set([])
    });
    this.showDetailModal.set(true);
    this.showLabelPicker.set(false);
    const workspaceId = Number(localStorage.getItem('workspaceId'));
    this.labelService.getLabelsByWorkspace(workspaceId).subscribe({
      next: (labels) => this.workspaceLabels.set(labels || []),
      error: () => this.workspaceLabels.set([])
    });
  }

  isOverdue(dueDate: string): boolean {
    return dueDate < new Date().toISOString().split('T')[0];
  }
  closeDetailModal(){
    this.showDetailModal.set(false);
    this.taskComments.set([]);
    this.newCommentContent.set('');
  }

  deleteTask(id : number){
    this.taskService.deleteTask(id).subscribe({
      next : (task) => {
        this.tasks.set(this.tasks().filter(t => t.id !== id));
        this.applyFilter();
        },
      error : (error)=> {
        console.error("Erreur lors de la suppression !", error)
        }
      });

    }

  addComment() {
    const content = this.newCommentContent().trim();
    if (!content) return;
    const task = this.selectedTask()!;
    const comment: CommentDTO = { content, taskId: task.id!, authorId: this.userId };
    this.commentService.createComment(comment).subscribe({
      next: (created) => {
        this.taskComments.set([...this.taskComments(), created]);
        this.newCommentContent.set('');
        if (task.assigneeId && task.assigneeId !== this.userId) {
          const msg = `${this.authService.getCurrentUserName()} a commenté sur la tâche : ${task.title}`;
          this.notificationsService.createNotification(task.assigneeId, msg, 'COMMENT_ADDED', task.id).subscribe();
        }
      },
      error: (err) => console.error('Erreur ajout commentaire', err)
    });
  }

  deleteComment(commentId: number) {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => this.taskComments.set(this.taskComments().filter(c => c.id !== commentId)),
      error: (err) => console.error('Erreur suppression commentaire', err)
    });
  }

  createLabel() {
    const name = this.newLabelName().trim();
    if (!name) return;
    const workspaceId = Number(localStorage.getItem('workspaceId'));
    const dto: LabelDTO = { name, color: this.newLabelColor(), workspaceId };
    this.labelService.createLabel(dto).subscribe({
      next: (created) => {
        this.workspaceLabels.set([...this.workspaceLabels(), created]);
        this.newLabelName.set('');
        this.newLabelColor.set('#6366f1');
      },
      error: (err) => console.error('Erreur création label', err)
    });
  }

  isLabelOnTask(labelId: number): boolean {
    return (this.selectedTask()?.labels ?? []).some(l => l.id === labelId);
  }

  toggleLabel(label: LabelDTO) {
    const task = this.selectedTask()!;
    if (this.isLabelOnTask(label.id!)) {
      this.labelService.removeLabelFromTask(task.id!, label.id!).subscribe({
        next: () => {
          const updated = { ...task, labels: (task.labels ?? []).filter(l => l.id !== label.id) };
          this.selectedTask.set(updated);
          this.tasks.set(this.tasks().map(t => t.id === updated.id ? updated : t));
        }
      });
    } else {
      this.labelService.addLabelToTask(task.id!, label.id!).subscribe({
        next: () => {
          const updated = { ...task, labels: [...(task.labels ?? []), label] };
          this.selectedTask.set(updated);
          this.tasks.set(this.tasks().map(t => t.id === updated.id ? updated : t));
        }
      });
    }
  }

  saveTask(){
    const task = this.selectedTask();
    if (!task) return;

    const dto: TaskDTO = {
      ...task,
      title: this.newTitle(),
      description: this.newDescription(),
      priority: this.newPriority(),
      dueDate: this.newDueDate() || undefined,
    };

    this.taskService.updateTask(task.id!, dto).subscribe({
      next: (updated) => {
        this.tasks.set(this.tasks().map(t => t.id === updated.id ? updated : t));
        this.applyFilter();
        this.closeDetailModal();
      },
      error: (err) => console.error('Erreur lors de la modification !', err)
    });
  }
}
