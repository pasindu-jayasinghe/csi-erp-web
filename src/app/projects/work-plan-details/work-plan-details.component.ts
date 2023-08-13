import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { AppService } from 'src/shared/AppService';
import { ActivityAttendance, ActivityAttendControllerServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { ACCEPTANCE_STATUS } from './accept-status.enum';

@Component({
  selector: 'app-work-plan-details',
  templateUrl: './work-plan-details.component.html',
  styleUrls: ['./work-plan-details.component.scss']
})
export class WorkPlanDetailsComponent implements OnInit {

  acAttend: ActivityAttendance = new ActivityAttendance()
  editEntryId: number
  actProgress: number
  plannedStartdDate: any
  plannedEndDate: any
  actName: string
  userId: number
  userRole: string | null
  bVisible: boolean = false
  isView: boolean = false
  items: any
  constructor(
    private route: ActivatedRoute,
    private acAttendServiceProxy: ActivityAttendControllerServiceProxy,
    protected messageService: MessageService,
    private appService: AppService,
    private router: Router,
    private activatedRoute: ActivatedRoute,





  ) { }

  async ngOnInit(): Promise<void> {

    this.items = [
      {
        label: 'ACCEPTED',
        icon: 'pi pi-check',
        command: () => {
          this.updateAcceptance(ACCEPTANCE_STATUS.ACCEPTED);
        }
      },
      {
        label: 'UNSATISFIED',
        icon: 'pi pi-info-circle',
        command: () => {
          this.updateAcceptance(ACCEPTANCE_STATUS.UNSATISFIED);

        }
      },
      {
        label: 'DELAYED',
        icon: 'pi pi-clock',
        command: () => {
          this.updateAcceptance(ACCEPTANCE_STATUS.DELAYED);
        }
      },

    ]

    this.userId = Number(this.appService.getProfileId());
    this.userRole = this.appService.getRole()
    if (this.userRole == "CEO") {
      this.bVisible = true
    }


    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.editEntryId = parseInt(id);
      await this.acAttendServiceProxy.getActivityAttendById(+id).subscribe(res => {
        this.acAttend = res;
      })

    }

    this.route.url.subscribe(r => {
      if (r[0].path.includes("view")) {
        this.isView = true;
      }
    });
  }




  async updateAcceptance(status: string) {

    let res = await this.acAttendServiceProxy.updateAcceptance(this.editEntryId, status).toPromise()
    if (res) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'sent acceptance successfully',
        closable: true,
      });

    }
    else {
      console.log("ERROR SENT FEED BACK")
    }


  }


  async send() {

    let res = await this.acAttendServiceProxy.updateFeedBack(this.editEntryId, this.acAttend.csiFeedBack ? this.acAttend.csiFeedBack : "", this.acAttend.staffFeedBack ? this.acAttend.staffFeedBack : "").toPromise()
    if (res) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'sent feedback successfully',
        closable: true,
      });

    }
    else {
      console.log("ERROR SENT FEED BACK")
    }


  }

  async update() {


    let res = await this.acAttendServiceProxy.updateActivityAttend(this.editEntryId, this.acAttend).toPromise()
    if (res) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'updated successfully',
        closable: true,
      });

    }
    else {
      console.log("ERROR UPDATE")
    }


  }



  async delete() {

    console.log("sssss", this.editEntryId)


    let res = await this.acAttendServiceProxy.remove(this.editEntryId.toString()).toPromise()
    if (res) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'deleted successfully',
        closable: true,
      });

    }
    else {
      console.log("ERROR DELETE")
    }


  }

  back() {

    this.router.navigate(['../work-plan-list'], { queryParams: {}, relativeTo: this.activatedRoute });

  }
}
