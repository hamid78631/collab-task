import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [],
  templateUrl: './stats-cards.html',
  styleUrls: ['./stats-cards.css']
})
export class StatsCardsComponent {
  @Input() totalBoards = 0;
  @Input() completedTasks = 0;
  @Input() lateTasks = 0;
  @Input() activeMembers = 0;
}
