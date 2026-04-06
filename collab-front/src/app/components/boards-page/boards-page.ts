import { Component, OnInit, inject, signal } from '@angular/core';
import { BoardService } from '../../services/board';
import { WorkspaceService } from '../../services/workspace';
import { BoardDTO } from '../../models/board.model';
import { WorkspaceDTO } from '../../models/workspace.model';

@Component({
  selector: 'app-boards-page',
  imports: [],
  templateUrl: './boards-page.html',
  styleUrl: './boards-page.css',
})
export class BoardsPageComponent implements OnInit {

  private boardService = inject(BoardService);
  private workspaceService = inject(WorkspaceService);

  workspaces = signal<WorkspaceDTO[]>([]);
  boardsByWorkspace = signal<Map<number, BoardDTO[]>>(new Map());

  ngOnInit() {
    this.workspaceService.getWorkspaces().subscribe({
      next: (workspaces) => {
        this.workspaces.set(workspaces || []);

        workspaces.forEach(ws => {
          this.boardService.getBoardsByWorkspaceId(ws.id).subscribe({
            next: (boards) => {
              const map = new Map(this.boardsByWorkspace());
              map.set(ws.id, boards || []);
              this.boardsByWorkspace.set(map);
            },
            error: (err) => console.error(`Erreur boards workspace ${ws.id}`, err)
          });
        });
      },
      error: (err) => console.error('Erreur de chargement des workspaces', err)
    });
  }
}
