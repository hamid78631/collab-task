import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskColumnDTO } from '../models/taskColumn.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskColumnService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:8086/api';

  // Créer une nouvelle colonne de tâches
  createTaskColumn(taskColumn: TaskColumnDTO) : Observable<TaskColumnDTO> {
    return this.http.post<TaskColumnDTO>(`${this.apiUrl}/taskColumn`, taskColumn);
  }

  //Modifier une colonne de tâches
  updateTaskColumn(taskColumnId: number, taskColumn: TaskColumnDTO) :  Observable<TaskColumnDTO>  {
    return this.http.put<TaskColumnDTO>(`${this.apiUrl}/taskColumn/${taskColumnId}`, taskColumn);
  }

  //Récupérer une colonne de tâches par son ID
  getTaskColumnById(taskColumnId: number) : Observable<TaskColumnDTO> {
    return this.http.get<TaskColumnDTO>(`${this.apiUrl}/taskColumn/${taskColumnId}`);
  }

  //Supprimer une colonne de tâches
  deleteTaskColumn(taskColumnId: number) : Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/taskColumn/${taskColumnId}`);
  }

  //Récupérer toutes les colonnes par boardId
  getAllTaskColumnsByBoardId(boardId: number) : Observable<TaskColumnDTO[]> {
    return this.http.get<TaskColumnDTO[]>(`${this.apiUrl}/taskColumns/all/${boardId}`);
  }
}
