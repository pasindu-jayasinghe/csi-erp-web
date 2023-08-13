import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActivitiesControllerServiceProxy, Activity, ActivityAttendance, ActivityAttendControllerServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-daily-progress-form',
  templateUrl: './daily-progress-form.component.html',
  styleUrls: ['./daily-progress-form.component.scss']
})
export class DailyProgressFormComponent implements OnInit {

  activityAttend: ActivityAttendance = new ActivityAttendance()
  actId:number
  planned_MD:number
  actual_MD:number
  progress:number

  date:Date = new Date()

  constructor(
    private activitytAttendServiceProxy: ActivityAttendControllerServiceProxy,
    private activityServicePeoxy:ActivitiesControllerServiceProxy,
    protected messageService: MessageService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,

  ) { }

  ngOnInit(): void {

    if (this.config.data) {
     this.actId = this.config.data.activityId;
     this.getActivity()

    }

  }

  async save(activitytAttendForm: NgForm) {

    if (activitytAttendForm.valid) {


      try {
        this.activityAttend.activity.id = this.actId
        let res = await this.activitytAttendServiceProxy.createActivityAttend(this.actId,this.activityAttend).toPromise();
        if (res?.activity.id) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'has saved successfully',
            closable: true,
          });
          this.ref.close();
        }else{
          this.messageService.add({
            severity: 'info',
            summary: 'Already Subimtted',
            detail: 'You have already submitted the daily progress related to this activity',
            closable: true,
          });
        }


      } catch (error) {

      }




    }

  }

  async getActivity(){

   this.activityServicePeoxy.getActivityById(this.actId).subscribe((res) =>{
   this.planned_MD= res.planned_MD
   this.actual_MD = res.used_MD
   this.progress = res.progress
   })

  


  }



}
