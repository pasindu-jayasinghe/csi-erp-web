import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { LazyLoadEvent } from 'primeng/api';
import decode from 'jwt-decode';
import {
  Audit,
  AuditControllerServiceProxy,
  ServiceProxy,
  User,
} from '../../shared/service-proxies/service-proxies';
import { AppService } from 'src/shared/AppService';


@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {
  loading: boolean;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  event: any;
  Date =new Date();
  searchText: string;
  status: string[] = [];
  activityList: string[] = [];
  userList: string[] = [];
  searchBy: any = {
    text: null,
    user: null,
    activity: null,
    editedOn: null,
  };

  first = 0;
  activities: Audit[];
  dateList: Date[] = [];
  loggedusers: User[];
  

  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
   private auditproxy: AuditControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private appService: AppService,
  ) { }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {

    
    const username = this.appService.getFirstName()

    let filters: string[] = [];
    filters.push('username||$eq||' + username);
    // console.log("filters",filters)

  }

  onactivityChange(event: any) {
    this.onSearch();
  }
  ondateChange(event: any) {
    this.onSearch();
  }
  onUTChange(event: any) {
    this.onSearch();
  }

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }


  loadgridData = (event: LazyLoadEvent) => {
    console.log('event Date', event);
    this.loading = true;
    this.totalRecords = 0;


    let user = this.searchBy.user ? this.searchBy.user : '';
    let action = this.searchBy.activity ? this.searchBy.activity : '';
    let filtertext = this.searchBy.text ? this.searchBy.text : '';



    console.log(
      moment(this.searchBy.editedOn).format('YYYY-MM-DD'),
      'jjjjjjjjjjjjjjjj'
    );
    let editedOn = this.searchBy.editedOn
      ? moment(this.searchBy.editedOn).format('YYYY-MM-DD')
      : '';

    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    setTimeout(() => {
      this.auditproxy
        .getAuditDetails(
          pageNumber,
          this.rows,
          user,
          action,
          editedOn,
          filtertext,
        )

        .subscribe((a) => {
          this.activities = a.items;

          console.log("aaaaasssss--", this.activities)

          console.log(a, 'kk');
          this.totalRecords = a.meta.totalItems;
          this.loading = false;

          for (let d of a.items) {
            if (!this.status.includes(d.actionStatus)) {
              this.status.push(d.actionStatus);
            }

            if (!this.userList.includes(d.userName)) {
              this.userList.push(d.userName);
            }

            console.log(this.dateList);
          }
        });
    }, 1000);
  };
}
