import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LeavesComponent } from './leaves/leaves.component';
import { ActivityFormComponent } from './projects/activity-form/activity-form.component';
import { ProjectFormComponent } from './projects/project-form/project-form.component';
import { ProjectsComponent } from './projects/projects.component';
import { SubtaskFormComponent } from './projects/subtask-form/subtask-form.component';
import { TaskFormComponent } from './projects/task-form/task-form.component';
import { LoggedBaseComponent } from './logged-base/logged-base.component';
import { AuthGuard } from './auth/auth.guard';





const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [],
    data: {}
  },




 
  { 
    path: 'app',
    component: LoggedBaseComponent,
    loadChildren: () => import('./logged-base/logged-base.module').then((m) => m.LoggedBaseModule),
    canActivate: [AuthGuard],
    data: {}
  },
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
