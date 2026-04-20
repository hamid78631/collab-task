import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { BoardView } from './components/board-view/board-view';
import { BoardsPageComponent } from './components/boards-page/boards-page';
import { authGuard } from './guards/auth.gaurd-guard';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { TaskPageComponent } from './components/tasks-page/tasks-page';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'board/:id', component: BoardView, canActivate: [authGuard] },
  { path: 'boards', component: BoardsPageComponent, canActivate: [authGuard] },
  {path : 'tasks' , component : TaskPageComponent ,  canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },

];
