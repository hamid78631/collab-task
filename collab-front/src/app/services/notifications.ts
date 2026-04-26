import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationDTO } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {

  private apiUrl = 'http://localhost:8086/api';
  constructor(private httpClient: HttpClient) {}

  getUnreadNotification(userId: number): Observable<NotificationDTO[]> {
    return this.httpClient.get<NotificationDTO[]>(`${this.apiUrl}/notifications/unRead/${userId}`);
  }

  markedRead(notificationId: number): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/notifications/markAsRead/${notificationId}`, {});
  }

  createNotification(userId: number, message: string, type: string, taskId?: number, boardId?: number): Observable<void> {
    let params = new HttpParams().set('message', message).set('type', type);
    if (taskId != null) params = params.set('taskId', taskId.toString());
    if (boardId != null) params = params.set('boardId', boardId.toString());
    return this.httpClient.post<void>(`${this.apiUrl}/notifications/save/${userId}`, {}, { params });
  }
}
