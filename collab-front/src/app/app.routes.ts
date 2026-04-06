import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { BoardView } from './components/board-view/board-view';
import { BoardsPageComponent } from './components/boards-page/boards-page';

export const routes: Routes = [
    {path: '' , redirectTo : 'dashboard' , pathMatch : 'full'},
    {path: 'dashboard' , component: Dashboard},
    {path : 'board/:id' , component: BoardView},
    {path : 'boards' , component : BoardsPageComponent},
    {path: '**', redirectTo: 'dashboard'}
];
