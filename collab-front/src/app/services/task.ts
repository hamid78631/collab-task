import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskDTO } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:8086/api';


  constructor(private httpClient: HttpClient) {}

  createTask(task: TaskDTO): Observable<TaskDTO> {
    return this.httpClient.post<TaskDTO>(`${this.apiUrl}/task`, task);
  }

  updateTask(taskId: number, task: TaskDTO): Observable<TaskDTO> {
    return this.httpClient.put<TaskDTO>(`${this.apiUrl}/task/${taskId}`, task);
  }

  getTaskById(taskId: number): Observable<TaskDTO> {
    return this.httpClient.get<TaskDTO>(`${this.apiUrl}/task/${taskId}`);
  }

  getTaskByTitle(title: string): Observable<TaskDTO> {
    return this.httpClient.get<TaskDTO>(`${this.apiUrl}/task?title=${title}`);
  }

  deleteTask(taskId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/task/${taskId}`);
  }

  getAllTasks(): Observable<TaskDTO[]> {
    return this.httpClient.get<TaskDTO[]>(`${this.apiUrl}/tasks/all`);
  }

  getAllTasksByTaskColumnId(taskColumnId: number): Observable<TaskDTO[]> {
    return this.httpClient.get<TaskDTO[]>(`${this.apiUrl}/tasks/column/${taskColumnId}`);
  }

  getAllTasksByAssigneeId(assigneeId: number): Observable<TaskDTO[]> {
    return this.httpClient.get<TaskDTO[]>(`${this.apiUrl}/tasks/assignee/${assigneeId}`);
  }

  moveTask(taskId: number, newColumnId: number, newPosition: number): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/tasks/${taskId}/move`, {
      newColumnId,
      newPosition,
    });
  }
}