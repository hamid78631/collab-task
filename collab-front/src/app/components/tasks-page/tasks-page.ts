import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task';
import { AuthService } from '../../services/auth';
import { TaskDTO } from '../../models/task.model';

@Component({
  selector: 'app-tasks-page',
  imports: [FormsModule, DatePipe, RouterLink],
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.css',
})
export class TaskPageComponent implements OnInit {

  private taskService = inject(TaskService);
  private authService = inject(AuthService);

  tasks = signal<TaskDTO[]>([]);
  filteredTasks = signal<TaskDTO[]>([]);
  selectedPriority = signal<string>('ALL');

  userId = this.authService.getCurrentUserId();

  showDetailModal = signal<boolean>(false);
  selectedTask = signal<TaskDTO | null>(null);


  newTitle = signal<string>("");
  newDescription = signal<string>("");
  newPriority = signal<'HIGH' | 'LOW' | 'MEDIUM'>('LOW');

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
    this.showDetailModal.set(true);
  }
  closeDetailModal(){
    this.showDetailModal.set(false);
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

  saveTask(){
    const task = this.selectedTask();
    if (!task) return;

    const dto: TaskDTO = {
      ...task,
      title: this.newTitle(),
      description: this.newDescription(),
      priority: this.newPriority(),
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
