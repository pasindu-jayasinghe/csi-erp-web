import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupName } from 'src/shared/service-proxies/service-proxies';
import { AuthGuard } from '../auth/auth.guard';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { UserViewComponent } from './user-view/user-view.component';
import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'user',
    },
    children: [
        {
            path: 'list',
            component: UserComponent,
            canActivate: [AuthGuard],
            data: {
                title: 'user list',
                groups: [
                  GroupName.CEO,
                ],
            },
        },
        {
          path: 'add',
          component: ManageUserComponent,
          canActivate: [AuthGuard],
          data: {
              title: 'user add',
              groups: [
                GroupName.CEO,
              ],
          },
      },
      {
        path: 'edit',
        component: ManageUserComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'user edit',
            groups: [
              GroupName.CEO,
            ],
        },
    },
    {
      path: 'view',
      component: UserViewComponent,
     
  },
      


    ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
