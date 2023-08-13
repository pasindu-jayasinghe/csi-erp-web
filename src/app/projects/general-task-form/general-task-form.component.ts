import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppService } from 'src/shared/AppService';
import { GeneralTask, GeneralTaskControllerServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-general-task-form',
  templateUrl: './general-task-form.component.html',
  styleUrls: ['./general-task-form.component.scss']
})
export class GeneralTaskFormComponent implements OnInit {

  gTask:GeneralTask = new GeneralTask()
  date:Date
  userId:number

  constructor(
    protected messageService: MessageService,
    public ref: DynamicDialogRef,
    private gtaskServiceproxy:GeneralTaskControllerServiceProxy,
    private appService: AppService,

    
  ) { 

    
  }

  ngOnInit(): void {
    this.userId = Number(this.appService.getProfileId());
  }



  async save(gtaskForm:NgForm){
    this.gTask.user.id = this.userId
    this.gTask.date = moment(this.date)

    if (gtaskForm.valid) {
      let res = await this.gtaskServiceproxy.createGTask(this.gTask).toPromise();
      console.log("ss",res)
      if (res) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'has saved successfully',
          closable: true,
        });
        this.ref.close();
      }



    }
  }


}
