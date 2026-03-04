import { Component,OnInit } from '@angular/core';
import { BoardService } from '../../services/board';
import { BoardDTO } from '../../models/board.model';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  boards: BoardDTO[] = [];

  constructor(private boardService: BoardService) {}

  ngOnInit(): void {

    this.boardService.getBoardsByWorkspaceId(1).subscribe({
      next: (data)=> {
        this.boards = data;
        console.log("Board chargées avec succès : ", data);
      },
      error: (err) => console.error("Erreur lors du chargement des boards : ", err)
    });
  }
}
