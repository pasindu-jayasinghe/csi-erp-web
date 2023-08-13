import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ActivitiesControllerServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-next-wp-form',
  templateUrl: './next-wp-form.component.html',
  styleUrls: ['./next-wp-form.component.scss']
})
export class NextWpFormComponent implements OnInit {

  fromDate: Date;
  toDate: Date;
  weekMDs: number;
  actId: number

  constructor(
    private activityServicePeoxy: ActivitiesControllerServiceProxy,
    protected messageService: MessageService,
    public config: DynamicDialogConfig,



  ) { }

  ngOnInit(): void {

    if (this.config.data) {
      this.actId = this.config.data.activityId;

    }
  }



  async update(activityForm: NgForm) {

    if (activityForm.valid) {
      let res = await this.activityServicePeoxy.updateNextWeekActivityMDs(this.actId, moment(this.fromDate), moment(this.toDate), this.weekMDs).toPromise()
      if (res) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'add to next week plan',
          closable: true,
        });

      }
      else {
        console.log("ERROR")
      }


    }



  }

  changeDate() { }
}
