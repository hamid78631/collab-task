import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { WorkspaceDTO } from '../models/workspace.model'; 
import { UserDTO } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {

  private apiUrl = 'http://localhost:8086/api';

  constructor(private httpClient: HttpClient) {}

  // Récupérer tous les workspaces
  getWorkspaces(): Observable<WorkspaceDTO[]> {
    return this.httpClient.get<WorkspaceDTO[]>(`${this.apiUrl}/workspaces`);
  }

  // Récupérer un workspace par son ID
  getWorkspaceById(id: number): Observable<WorkspaceDTO> {
    return this.httpClient.get<WorkspaceDTO>(`${this.apiUrl}/workspaces/${id}`);
  }

  // Créer un nouveau workspace
  createWorkspace(workspace: WorkspaceDTO): Observable<WorkspaceDTO> {
    return this.httpClient.post<WorkspaceDTO>(`${this.apiUrl}/workspace`, workspace);
  }

  // Mettre à jour un workspace existant
  updateWorkspace(id: number, workspace: WorkspaceDTO): Observable<WorkspaceDTO> {
    return this.httpClient.put<WorkspaceDTO>(`${this.apiUrl}/workspace/${id}`, workspace);
  }

  // Supprimer un workspace
  deleteWorkspace(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/workspace/${id}`);
  }

  // Ajouter un membre (on utilise UserDTO pour les membres)
  addMemberToWorkspace(workspaceId: number, userId: number): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/workspaces/${workspaceId}/collaborators`, { userId });
  }

  // Supprimer un membre
  removeMemberFromWorkspace(workspaceId: number, userId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/workspaces/${workspaceId}/collaborators/${userId}`);
  }

  // Récupérer les membres
  getWorkspaceMembers(workspaceId: number): Observable<UserDTO[]> {
    return this.httpClient.get<UserDTO[]>(`${this.apiUrl}/workspaces/${workspaceId}/collaborators`);
  }
}