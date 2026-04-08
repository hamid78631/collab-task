import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommentDTO } from '../models/comment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}

  private api = 'http://localhost:8086/api';
  createComment(commentDTO: CommentDTO): Observable<CommentDTO> {
    return this.http.post<CommentDTO>(`${this.api}/comment`, commentDTO);
  }

  getCommentsByTask(taskId: number): Observable<CommentDTO[]> {
    return this.http.get<CommentDTO[]>(`${this.api}/comments/task/${taskId}`);
  }

  deleteComment(commentId: number): Observable<CommentDTO> {
    return this.http.delete<CommentDTO>(`${this.api}/comment/${commentId}`);
  }
}
