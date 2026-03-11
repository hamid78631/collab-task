import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { UserDTO } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getUsers(): Observable<UserDTO[]> {
    return this.httpClient.get<UserDTO[]>(`${environment.backendHost}/users`);
  }

  getUserById(userId: number): Observable<UserDTO> {
    return this.httpClient.get<UserDTO>(`${environment.backendHost}/user/${userId}`);
  }

  searchUser(email: string, name: string): Observable<UserDTO[]> {
    let params = new HttpParams();
    if (email) params = params.set('email', email);
    if (name) params = params.set('name', name);

    return this.httpClient.get<UserDTO[]>(`${environment.backendHost}/users/search`, { params });
  }

  createUser(userDTO: UserDTO): Observable<UserDTO> {
    return this.httpClient.post<UserDTO>(`${environment.backendHost}/users`, userDTO);
  }

  updateUser(userId: number, userDTO: UserDTO): Observable<UserDTO> {
    return this.httpClient.put<UserDTO>(`${environment.backendHost}/user/${userId}`, userDTO);
  }

  deleteUser(userId: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.backendHost}/user/${userId}`);
  }
}