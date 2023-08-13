import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { UserComponent } from './user.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SharedModule } from 'src/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { UserViewComponent } from './user-view/user-view.component';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';



@NgModule({
  declarations: [
    ManageUserComponent,
    UserComponent,
    UserViewComponent
  ],
  imports: [
    ButtonModule,
    CommonModule,
    UserRoutingModule,
    FormsModule,
    DropdownModule,
    MultiSelectModule,
    InputTextareaModule,
    SharedModule,
    CalendarModule,
    DialogModule,
    TableModule
  ]
})
export class UserModule { }
