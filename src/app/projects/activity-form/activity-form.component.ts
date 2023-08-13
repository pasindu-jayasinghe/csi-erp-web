import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppService, LocalData } from 'src/shared/AppService';
import { ActivitiesControllerServiceProxy, Activity, Project, ServiceProxy, UserControllerServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss']
})
export class ActivityFormComponent implements OnInit {

  isNewEntry: boolean = true;
  isView: boolean = false;
  editEntryId: number | undefined;
  employees: any
  deadline: Date | undefined
  planned_start_date: Date | undefined
  planned_end_date: Date | undefined
  activity: Activity = new Activity()
  @Input() editing: boolean = false;
  @Input() editaddChild: boolean = true
  @Input() editDelete:boolean = true


  userId: any
  userRole: any


  currenProject: any
  constructor(

    private route: ActivatedRoute,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public config: DynamicDialogConfig,
    private serviceProxy: ServiceProxy,
    private activityServiceProxy: ActivitiesControllerServiceProxy,
    protected messageService: MessageService,
    public ref: DynamicDialogRef,
    private userServiceProxy: UserControllerServiceProxy,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private appService: AppService,


  ) { }

  async ngOnInit() {

    this.userId = Number(this.appService.getProfileId());
    this.userRole = this.appService.getRole()
    await this.setAction();
    await this.getEmplyees();


    if (this.config.data) {
      if (!this.config.data.activity && !this.config.data.edit) {
        this.activity.project.id = this.config.data.project.id
      }

      if (this.config.data.activity && this.config.data.edit) {
        if(this.config.data.activity.used_MD){this.editDelete = false}
        if (this.config.data.activity.assign_to.id) {
          this.editaddChild = false
        }

        this.editing = true;

        let res = await this.activityServiceProxy.getActivityById(this.config.data.actId).toPromise();
        this.activity = res as Activity
        this.activity.assign_to =  this.employees.filter((obj:any) => {
          return obj.id === this.activity.assign_to.id;
        })[0];

        this.planned_start_date = this.activity.planned_start_date?.toDate()
        this.planned_end_date = this.activity?.planned_end_date?.toDate()
        this.deadline = this.activity?.deadline?.toDate()

        const pdata = this.config.data.project.id;
        const datapString = JSON.stringify(pdata);
        if (datapString !== undefined) {
          localStorage.setItem(LocalData.pData, datapString);
        }
      } else if (this.config.data.activity && !this.config.data.edit) {
        this.activity.parent_activity = this.config.data.activity
        this.currenProject = JSON.parse(localStorage.getItem(LocalData.pData) || '{}');
        this.activity.project.id = +this.currenProject

        // // localStorage.removeItem(key);

      }
    }

  }

  async getEmplyees() {
    this.employees = await this.userServiceProxy.getALlUsers().toPromise()
    console.log("users", this.employees)
  }


  setAction() {
    this.route.url.subscribe(r => {
      if (r[0].path.includes("view")) {
        this.isView = true;
      }
    });

    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.editEntryId = parseInt(id);
      this.isNewEntry = false;
    }
  }

  async saveActivity(activitytForm: NgForm) {
    if (activitytForm.valid) {
      try {
        if (!this.activity.id) {
          this.activity.planned_start_date = moment(this.planned_start_date)
          this.activity.deadline = moment(this.deadline)
          this.activity.planned_end_date = moment(this.planned_end_date)
          this.activity.assign_by.id = this.userId;
          let res = await this.activityServiceProxy.createActivity(this.activity).toPromise();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'has saved successfully',
            closable: true,
          });
          this.ref.close();

        } else {
          this.activity.planned_start_date = moment(this.planned_start_date)
          this.activity.deadline = moment(this.deadline)
          this.activity.planned_end_date = moment(this.planned_end_date)
          this.activity.assign_by.id = this.userId;
          console.log("update--",this.activity)
          let res = await this.activityServiceProxy.updateActivity(this.activity.id, this.activity).toPromise();
          console.log("updatereee--",res)

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'has updated successfully',
            closable: true,
          });
          this.ref.close();
        }

      } catch (error) {

      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Fill All Mandatory fields',
        closable: true,
      });


    }
  }


  newTask() {
    this.router.navigate(['../task-add'], { relativeTo: this.activatedRoute });

  }



  openActivityModel2() {
    const ref1 = this.dialogService.open(ActivityFormComponent, {
      header: 'Add child Activity to ' + this.activity.name,
      width: '50%',
      data: {
        activity: this.activity,
        edit: false,
        // addchild: true
        // user: TODO
      },
    });

    ref1.onClose.subscribe(async r => {
      // await this.getActs();
      this.ref.close();

    })
  }

  deleteactivity() {
    this.confirmationService.confirm({
      message: 'All the child activities also will be deleted',
      header: 'Are you sure you want to delete this activity?',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: async () => {
        await this.deleteSingleActivity(this.activity);

        // localStorage.removeItem(SavedData.units)
        // localStorage.removeItem(SavedData.parentUnits)
        this.ref.close();
      },
      reject: () => { },
    });
  }

  async deleteSingleActivity(activity: Activity) {
    try {
      let res = await this.activityServiceProxy.deleteActivities(activity.id).toPromise();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: "deletetion success ",
        closable: true,
      });

      // localStorage.removeItem(SavedData.units)
      // localStorage.removeItem(SavedData.parentUnits)
    } catch (err) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: "Failed to delete " + activity.name,
        closable: true,
      });
    }
  }


}
