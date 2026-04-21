import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { NotificationDTO } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {

  private apiUrl = 'http://localhost:8086/api';
  constructor(private httpClient : HttpClient){}

  getUnreadNotification(idNotification : number) : Observable<NotificationDTO[]>{
    return this.httpClient.get<NotificationDTO[]>(`${this.apiUrl}/notifications/unRead/${idNotification}`);

    }

  markedRead(idNotification : number): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/notifications/markAsRead/${idNotification}`, {});
  }


}
