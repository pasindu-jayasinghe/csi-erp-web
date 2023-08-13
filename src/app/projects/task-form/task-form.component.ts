import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppService } from 'src/shared/AppService';
import { MasterDataService } from 'src/shared/master-data.service';
import { ActivitiesControllerServiceProxy, ProjectControllerServiceProxy, User, UserControllerServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { DailyProgressFormComponent } from '../daily-progress-form/daily-progress-form.component';
import { GeneralTaskFormComponent } from '../general-task-form/general-task-form.component';
import { NextWpFormComponent } from '../next-wp-form/next-wp-form.component';
import { TaskDetailComponent } from '../task-detail/task-detail.component';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  aTasks: any | undefined
  //task: any
  msgs1: Message[];
  userId: number
  filtertUserId: number = 0
  userRole: string | null
  styleOBJ: any
  styleOBJ2: any
  ptext: any
  users: User[] = []
  user: any

  activityStatus: any;

  filterStatus: any = 0
  projects: any;
  filterProjectId: any = 0;
  dates: any = [];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private activityServiceProxy: ActivitiesControllerServiceProxy,
    public dialogService: DialogService,
    public ref: DynamicDialogRef,
    private appService: AppService,
    private userServiceProxy: UserControllerServiceProxy,
    private masterDataService: MasterDataService,
    private projectServiceProxy: ProjectControllerServiceProxy,




  ) { }

  async ngOnInit(): Promise<void> {

    this.activityStatus = this.masterDataService.activity_status

    await this.getUsers()
    this.userId = Number(this.appService.getProfileId());
    this.userRole = this.appService.getRole()
    await this.getAssignTasks()
    this.styleOBJ = { 'background': '#E8F8F5', width: '360px', 'margin': '1em' }
    this.styleOBJ2 = { 'background': '#c8f7d5', width: '360px', 'margin': '1em' }

    if (this.userRole == "CEO") { this.ptext = "All Tasks" } else { this.ptext = "My Tasks" }
    this.projects = await this.projectServiceProxy.getAssignProjects(this.userId, this.userRole + '').toPromise();

  }

  async getAssignTasks() {
    this.aTasks = await this.activityServiceProxy.getAssignActivities(
      this.userId,
      this.filtertUserId,
      // @ts-ignore
      this.userRole,
      this.filterStatus,
      this.filterProjectId ? this.filterProjectId : 0,
      this.dates).toPromise();


  }

  async changeUser(event: any) {
    if (event.value) {
      this.filtertUserId = event.value;
    } else {
      this.filtertUserId = 0;
    }
    await this.getAssignTasks()

  }

  async changeStatus(event: any) {
    console.log("==========", event)

    if (event.value) {
      this.filterStatus = event.value;
    } else {
      this.filterStatus = 0;
    }
    await this.getAssignTasks()

  }
  async changeProject(event: any) {
    console.log("==========", event)

    if (event.value) {
      this.filterProjectId = event.value;
    } else {
      this.filterProjectId = 0;
    }
    await this.getAssignTasks()

  }
  async changeDate(event: any) {
    console.log("==========", this.dates)


    
    if (this.dates === null) {
      console.log("sssss")
      this.dates = []
      await this.getAssignTasks()
    }
    else if (this.dates[1] !== null) {
      await this.getAssignTasks()
    }


    // if (event.value) {
    //   console.log("aaaa",event.value)
    //   this.dates
    // } else {
    //   this.dates = []
    // }
    // await this.getAssignTasks()

  }


  getSeverity(status: string): string {
    switch (status) {
      case 'Todo':
        return 'info';
      case 'Inprogress':
        return 'warning';
      case 'Complete':
        return 'success';
      case 'Overdue':
        return 'danger';
      default:
        return 'success';
    }
  }

  addDailyProgress(id: number) {

    const ref1 = this.dialogService.open(DailyProgressFormComponent, {
      header: 'Add Daily Progress',
      width: '50%',
      data: {
        activityId: id,
        edit: false,
      },
    });

    ref1.onClose.subscribe(async r => {
      await this.getAssignTasks()
      this.ref.close();

    })
  }

  addNextWP(id: number) {

    const ref1 = this.dialogService.open(NextWpFormComponent, {
      header: 'Add to Next Week Plan',
      width: '50%',
      data: {
        activityId: id,
        edit: false,
      },
    });

    ref1.onClose.subscribe(async r => {
      await this.getAssignTasks()
      this.ref.close();

    })
  }


  viewTask(id: number) {
    console.log("viewww", id)

    const ref1 = this.dialogService.open(TaskDetailComponent, {
      header: 'Task Detail',
      width: '50%',
      data: {
        activityId: id,
        edit: false,
      },
    });

    ref1.onClose.subscribe(async r => {
      await this.getAssignTasks()
      this.ref.close();

    })
  }


  addGTask() {

    const ref1 = this.dialogService.open(GeneralTaskFormComponent, {
      header: 'General Task',
      width: '50%',
      data: {

      },
    });

    ref1.onClose.subscribe(async r => {
      await this.getAssignTasks()
      this.ref.close();

    })
  }


  async getUsers() {
    this.userServiceProxy.getALlUsers().subscribe((res) => {
      this.users = res
    })

  }


}




