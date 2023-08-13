import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { SharedModule } from 'src/shared/shared.module';
import { ActivityFormComponent } from './activity-form/activity-form.component';
import { ProjectFormComponent } from './project-form/project-form.component';
import { ProjectsComponent } from './projects.component';
import { TaskFormComponent } from './task-form/task-form.component';
import {TreeModule} from 'primeng/tree';
import {TreeNode} from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { ActivitiesControllerServiceProxy, ActivityAttendControllerServiceProxy, GeneralTaskControllerServiceProxy, ProjectControllerServiceProxy,  UserControllerServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';

import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DailyProgressFormComponent } from './daily-progress-form/daily-progress-form.component';
import { WorkPlanComponent } from './work-plan/work-plan.component';
import { TableModule } from 'primeng/table';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import {SplitterModule} from 'primeng/splitter';
import { GeneralTaskFormComponent } from './general-task-form/general-task-form.component';
import { WorkPlanDetailsComponent } from './work-plan-details/work-plan-details.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { MasterDataService } from 'src/shared/master-data.service';
import { InputMaskModule } from 'primeng/inputmask';
import { GtaskDetailComponent } from './gtask-detail/gtask-detail.component';
import { NextWpFormComponent } from './next-wp-form/next-wp-form.component';
import { NextWpListComponent } from './next-wp-list/next-wp-list.component';
import { TooltipModule } from 'primeng/tooltip';
import { SplitButtonModule } from 'primeng/splitbutton';


const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Project',
        },
        children: [
            {
                path: 'add',
                component: ProjectFormComponent,
                data: {
                    title: 'Project create',
                },
            },
            {
                path: 'view',
                component: ProjectFormComponent,
                data: {
                    title: 'Project List',
                },
            },
            {
                path: 'edit',
                component: ProjectFormComponent,
                data: {
                    title: 'Project Edit',
                },
            },
            {
                path: 'import',
                component: ProjectFormComponent,
                data: {
                    title: 'Project Import',
                },
            },

            {
                path: 'list',
                component: ProjectsComponent,
            },


        ]
    },
    
    {

    path: '',
    data: {
        title: 'Tasks',
    },
    children: [
 
          {
            path:'task-list',
            component: TaskFormComponent,
          },
      
        


    ]
},


{

    path: '',
    data: {
        title: 'WorkPlan',
    },
    children: [
 
          {
            path:'work-plan-list',
            component: WorkPlanComponent,
          },
          {
            path:'work-plan-detail-edit',
            component: WorkPlanDetailsComponent,
          },

          {
            path:'work-plan-detail-view',
            component: WorkPlanDetailsComponent,
          },
          {
            path:'gtask-detail-edit',
            component: GtaskDetailComponent,
          },

          {
            path:'gtask-detail-view',
            component: GtaskDetailComponent,
          },

          {
            path:'next-wp-list',
            component: NextWpListComponent,
          },
          
          
      
        


    ]
},




]


@NgModule({
    declarations: [
        ProjectFormComponent,
        ProjectsComponent,
        TaskFormComponent,
        DailyProgressFormComponent,
        WorkPlanComponent,
        TaskDetailComponent,
        GeneralTaskFormComponent,
        WorkPlanDetailsComponent,
        GtaskDetailComponent,
        NextWpFormComponent,
        NextWpListComponent


    ],
    imports: [
        RouterModule.forChild(routes),

        ButtonModule,
        DropdownModule,
        CommonModule,
        DropdownModule,
        FormsModule,
        CardModule,
        ToolbarModule,
        SharedModule,
        TreeModule,
        CalendarModule,
        ToastModule,
        MultiSelectModule,
        TagModule,
        ProgressBarModule,
        TableModule,
        SplitterModule,
        InputNumberModule,
        InputMaskModule ,
        
        FormsModule,
        TooltipModule,
        SplitButtonModule 
    ],
    providers: [
        UserControllerServiceProxy,
        ProjectControllerServiceProxy,
        DatePipe,
        ActivitiesControllerServiceProxy,
        DynamicDialogRef,
        ActivityAttendControllerServiceProxy,
        GeneralTaskControllerServiceProxy,
        MasterDataService
    ],
    exports: [


    ]
})
export class ProjectModule { }
