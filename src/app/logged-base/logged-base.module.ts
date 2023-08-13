import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LeavesComponent } from '../leaves/leaves.component';
import { AuthGuard } from '../auth/auth.guard';
import { DropdownModule } from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CalendarModule } from 'primeng/calendar';
import { ProgressBarModule } from 'primeng/progressbar';
import { NbLayoutModule } from '@nebular/theme';
import { UserComponent } from '../user/user.component';
import { GroupName } from 'src/shared/service-proxies/service-proxies';
import { AuditComponent } from '../audit/audit.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path:'leaves',
    component: LeavesComponent,
    // canActivate: [AuthGuard],
  },
  {
    path:'dashboard',
    component: DashboardComponent,
    // canActivate: [AuthGuard],
  },
  {
    path:'audit',
    component: AuditComponent,
    canActivate: [AuthGuard],
    data: {
        title: '',
        groups: [
          GroupName.CEO,
        ],
    },
  },

  {
    path: 'user',
    loadChildren: () => import('../user/user.module').then((m) => m.UserModule),
    canActivate: [],
    data: {}
  },

  {
    path: 'projects',
    loadChildren: () => import('../projects/project.module').then((m) => m.ProjectModule),
    canActivate: [],
    data: {}
  },

]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
 
  ]
})
export class LoggedBaseModule { }
