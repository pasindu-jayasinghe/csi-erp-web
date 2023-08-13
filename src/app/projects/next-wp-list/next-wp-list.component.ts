import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { AppService } from 'src/shared/AppService';
import { ActivitiesControllerServiceProxy, Activity, User, UserControllerServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-next-wp-list',
  templateUrl: './next-wp-list.component.html',
  styleUrls: ['./next-wp-list.component.scss']
})
export class NextWpListComponent implements OnInit {

  searchBy: any = {
    text: null,
    user: null,
    dates: null

  };
  users: User[] = []

  loading: boolean;
  totalRecords: number = 0;
  rows: number = 100;
  last: number;
  event: any;
  userId: number = 0
  userRole: string | null
  dates: Date[];

  activities: Activity[];

  dropVisible: boolean = true

  constructor(

    private activityServiceProxy: ActivitiesControllerServiceProxy,
    private userServiceProxy: UserControllerServiceProxy,

    private appService: AppService,


  ) { }

  async ngOnInit(): Promise<void> {
    await this.getUsers();
    this.userId = Number(this.appService.getProfileId());
    this.userRole = this.appService.getRole()
    if (this.userRole == "CEO") {
      this.dropVisible = false
    }
    console.log("uRole--", this.userRole)
    let event: any = {};
    this.loadgridData(event)
  }


  async getUsers() {
    this.userServiceProxy.getALlUsers().subscribe((res) => {
      this.users = res
    })

  }
  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;
    this.loadgridData(event)

  }

  onChangeUser(event: any) {
    this.searchBy.user = event;
    this.onSearch();

  }

  changeDate(event: any) {
    this.searchBy.dates = this.dates;

    if (this.searchBy.dates === null) {
      this.onSearch();
    }
    else if (this.searchBy.dates[1] !== null) {
      this.onSearch();
    }

  }
  loadgridData = (event: LazyLoadEvent) => {

    this.loading = true;
    this.totalRecords = 0;

    if (this.userId > 0 && this.userRole !== "CEO") {
      this.userId = this.userId

    } else {
      this.userId = this.searchBy.user ? this.searchBy.user.id : 0;

    }
    this.dates = this.searchBy.dates ? this.searchBy.dates : [];

    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;


    this.activityServiceProxy
      .getActivitiesForWeekPlan(
        pageNumber,
        this.rows,
        this.userId,
        //@ts-ignore
        this.userRole,
        this.dates,

      ).subscribe((a) => {
        this.activities = a.items;
        this.totalRecords = a.meta.totalItems;
        this.loading = false;
      });

  };


}
