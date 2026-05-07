import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { WorkspaceDTO, WorkspaceMemberDTO, WorkspaceRole } from '../models/workspace.model';

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
  getWorkspacesByUser(id: number): Observable<WorkspaceDTO[]> {
    return this.httpClient.get<WorkspaceDTO[]>(`${this.apiUrl}/workspaces/user/${id}`);
  }

  // Récupérer un workspace par son ID
  getWorkspaceById(id: number): Observable<WorkspaceDTO> {
    return this.httpClient.get<WorkspaceDTO>(`${this.apiUrl}/workspaces/${id}`);
  }

  // Créer un nouveau workspace
  createWorkspace(workspace: WorkspaceDTO): Observable<WorkspaceDTO> {
    return this.httpClient.post<WorkspaceDTO>(`${this.apiUrl}/workspaces`, workspace);
  }

  // Mettre à jour un workspace existant
  updateWorkspace(id: number, workspace: WorkspaceDTO): Observable<WorkspaceDTO> {
    return this.httpClient.put<WorkspaceDTO>(`${this.apiUrl}/workspaces/${id}`, workspace);
  }

  // Supprimer un workspace
  deleteWorkspace(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/workspaces/${id}`);
  }

  addMemberToWorkspace(workspaceId: number, userId: number): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/workspaces/${workspaceId}/members/${userId}`, {});
  }

  removeMemberFromWorkspace(workspaceId: number, userId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/workspaces/${workspaceId}/members/${userId}`);
  }

  getWorkspaceMembers(workspaceId: number): Observable<WorkspaceMemberDTO[]> {
    return this.httpClient.get<WorkspaceMemberDTO[]>(`${this.apiUrl}/workspaces/${workspaceId}/members`);
  }

  changeRole(workspaceId: number, userId: number, role: WorkspaceRole): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}/workspaces/${workspaceId}/members/${userId}/role?role=${role}`, {});
  }
}
