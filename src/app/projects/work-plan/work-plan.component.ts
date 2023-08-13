import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { LazyLoadEvent } from 'primeng/api';
import { AppService } from 'src/shared/AppService';
import { ActivityAttendance, ActivityAttendControllerServiceProxy, GeneralTask, GeneralTaskControllerServiceProxy, User, UserControllerServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-work-plan',
  templateUrl: './work-plan.component.html',
  styleUrls: ['./work-plan.component.scss']
})
export class WorkPlanComponent implements OnInit {
  todayDate = new Date().toISOString().split('T')[0];
  searchBy: any = {
    text: null,
    user: null,
    date: null

  };
  loading: boolean;
  totalRecords: number = 0;
  rows: number = 100;
  last: number;
  event: any;
  status: number[] = [0, -10];

  userID: number
  userId: number
  userRole: string | null
  ptext:any

  dropVisible: boolean = true
  aAtendenses: ActivityAttendance[];
  gTasks:GeneralTask[];
  users: User[] = []
  constructor(

    private activityAttendServiceProxy: ActivityAttendControllerServiceProxy,
    private gtasksServiceProxy: GeneralTaskControllerServiceProxy,
    private userServiceProxy: UserControllerServiceProxy,
    private route: ActivatedRoute,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appService: AppService,


  ) {
    this.userID = Number(this.appService.getProfileId());
    console.log("constructor",this.userID)
    this.userRole = this.appService.getRole()

  }

  async ngOnInit(): Promise<void> {
 
    await this.getUsers();
    if (this.userRole == "CEO") { this.ptext = "Daily Progresses" } else { this.ptext = "My Daily Progress"}
    if (this.userRole == "CEO") {
      this.dropVisible = false
    }

    console.log("uid--",this.userID)

    let event: any = {};
    this.loadgridData(event)
    this.loadgridGtaskData(event)


  }

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event)
    this.loadgridGtaskData(event)

  }


  loadgridData = (event: LazyLoadEvent) => {
    console.log("inside-uid---",this.userID)

    this.loading = true;
    this.totalRecords = 0;


    if (this.userID > 0 && this.userRole !== "CEO") {
      this.userId = this.userID

    }
    else {
      this.userId = this.searchBy.user ? this.searchBy.user.id : 0;

    }
    let filtertext = this.searchBy.text ? this.searchBy.text : '';
    let date = this.searchBy.date ? this.searchBy.date : new Date()
    let hasDate = this.searchBy.date ? "true" : "false"



    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;

    this.activityAttendServiceProxy
      .getActiviyAttendance(
        pageNumber,
        this.rows,
        this.userId,
        date,
        hasDate
      ).subscribe((a) => {
        this.aAtendenses = a.items;
        console.log('aaaa',this.aAtendenses)
        this.totalRecords = a.meta.totalItems;
        this.loading = false;
      });

  };



  loadgridGtaskData = (event: LazyLoadEvent) => {
    console.log("insidegtask-uid---",this.userID)

    this.loading = true;
    this.totalRecords = 0;


    if (this.userID > 0 && this.userRole !== "CEO") {
      this.userId = this.userID
    }
    else {
      this.userId = this.searchBy.user ? this.searchBy.user.id : 0;

    }
    let filtertext = this.searchBy.text ? this.searchBy.text : '';
    let date = this.searchBy.date ? this.searchBy.date : new Date()
    let hasDate = this.searchBy.date ? "true" : "false"



    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;

    console.log('date--',date)


    this.gtasksServiceProxy
      .getGTasks(
        pageNumber,
        this.rows,
        this.userId,
        date,
        hasDate
      ).subscribe((a) => {
        this.gTasks = a.items;
        console.log("jjjj",this.gTasks)
        this.totalRecords = a.meta.totalItems;
        this.loading = false;
      });

  };





  onChangeUser(event: any) {
    this.searchBy.user = event;
    console.log("date", event)

    this.onSearch();

  }

  onChangeDate(event: any) {
    this.searchBy.date = event;
    this.onSearch();

  }

  async getUsers() {
    this.userServiceProxy.getALlUsers().subscribe((res) => {
      this.users = res
    })

  }

  viewDailyProgress(attend: any) {
    this.router.navigate(['../work-plan-detail-view'], { queryParams: { id: attend.id }, relativeTo: this.activatedRoute });


  }

  
  editDailyProgress(attend: any) {
    this.router.navigate(['../work-plan-detail-edit'], { queryParams: { id: attend.id }, relativeTo: this.activatedRoute });

  }

  viewGtask(gtask: any) {
    console.log("aaaa",gtask)
    this.router.navigate(['../gtask-detail-view'], { queryParams: { id: gtask.id }, relativeTo: this.activatedRoute });

  }

  editGtask(gtask: any) {
    this.router.navigate(['../gtask-detail-edit'], { queryParams: { id: gtask.id }, relativeTo: this.activatedRoute });


  }


}
