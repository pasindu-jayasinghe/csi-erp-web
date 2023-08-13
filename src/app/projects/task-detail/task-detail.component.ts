import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ActivitiesControllerServiceProxy, Activity } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {

  activity:Activity = new Activity()

  constructor(
    public config: DynamicDialogConfig,
    private activityServiceProxy: ActivitiesControllerServiceProxy,


  ) { }

  async ngOnInit(): Promise<void> {

    if(this.config.data){

      let actId = this.config.data.activityId;


      console.log("aaa",actId)

    

      let res = await this.activityServiceProxy.getActivityById(actId).toPromise();
      console.log("resss",res)
      this.activity = res as Activity

    }
  }

}
