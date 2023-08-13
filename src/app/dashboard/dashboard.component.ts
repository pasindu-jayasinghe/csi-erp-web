import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { environment } from 'src/environments/environment';
import { AppService, LeaveStatuses } from 'src/shared/AppService';
import { GroupName, Leave, LeaveCalc, LeavesControllerServiceProxy, LeaveType, LeaveTypeName, ProjectControllerServiceProxy, User, UserControllerServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../leaves/leaves.component.scss']
})
export class DashboardComponent implements OnInit {
  isRequestMode: boolean = false;
  leaveType: string = 'Approved by';
  calender1: any;
  value: number = 20;
  leavetypes: LeaveType[] = [];
  nth_time = [1, 2, 3];
  userId!: number;

  leave_starting_date: any;
  leave_end_date: any;
  reason: any;
  tl_respond_by: any;
  man_days: any;
  leave_type: any;
  isCEO: boolean = false;
  leaveDetails: any;
  buttonDisabled: boolean = false;
  remainingLeaveType: any;
  leavetypesForRequest: LeaveType[];
  thisWeekLeaves: Leave[] = [];
  usersForCEO: User[] = [];
  birthdayUSers: User[] = [];
  isValidMandays: boolean = true;
  changedLeaveStatusForMyLeaveList: LeaveStatuses = LeaveStatuses.PENDING;
  selectedLeaveTypeforMyLeaveList: LeaveType = new LeaveType();
  myLeaveList: Leave[] = [];
  loggedUserHigherGroup!: GroupName | null;
  projects: any[] = []
  userRole:any

  imageUrl: string = '';
  uploadedImgFile: File;
  private readonly baseUrl: string = "";



  constructor(
    private appService: AppService,
    private leavesControllerServiceProxy: LeavesControllerServiceProxy,
    private message: MessageService,
    private userControllerServiceproxy: UserControllerServiceProxy,
    private confirmationService: ConfirmationService,
    private projectServiceProxy: ProjectControllerServiceProxy,

  ) {
    this.baseUrl = environment.baseUrlAPI
   }

  async ngOnInit(): Promise<void> {
    this.loggedUserHigherGroup = this.appService.getHigherGroup();

    this.userId = Number(this.appService.getProfileId());
    this.userRole = this.appService.getRole()
    //@ts-ignore
    this.projects = await this.projectServiceProxy.getAssignProjects(this.userId, this.userRole).toPromise();
 

    this.isCEO = this.appService.isCEO();
    if (this.isCEO) {
      this.leavesControllerServiceProxy.getThisWeekLeaves().subscribe(res => {
        this.thisWeekLeaves = res;
        console.log("thisWeekLeaves", res);
      })
      this.userControllerServiceproxy.getALlUsers().subscribe(res => {
        this.usersForCEO = res;
        console.log("usersForCEO", res);
      })
    }
    console.log(this.isCEO, "CEO")

    this.userId = Number(this.appService.getProfileId());
    console.log(this.userId)
    this.leavesControllerServiceProxy.getLeaveTypes(this.userId).subscribe(res => {
      const target = LeaveTypeName.NoPay_leaveUnauthorized;
      this.leavetypes = res;
      this.leavetypesForRequest = res.filter(x => x.name !== target);
    })


    this.leavesControllerServiceProxy.getLeavedetails(this.userId).subscribe(res => {
      console.log("leaveDetails", res);
      this.leaveDetails = res;
    })
    this.userControllerServiceproxy.getBirthdays().subscribe(res => {

      for (let i of res) {
        var lastDigit = Number(i.age)
        if (lastDigit === 1) {
          i['endCharacter'] = 'st'

        }
        else if (lastDigit === 2) {
          i['endCharacter'] = 'nd'

        }
        else if (lastDigit === 3) {
          i['endCharacter'] = 'rd'

        }
        else {
          i['endCharacter'] = 'th'

        }
      }
      this.birthdayUSers = res;
      console.log("leaveDetails", res[0]['endCharacter']);
    })

  }
  
  
  showRequestLeave(){
    this.isRequestMode = true;
    console.log("dddd")
  }
  removeRequestLeave() {
    this.isRequestMode = false;
    console.log("ssss")
  }
  async onSubmit(formData: NgForm, op: OverlayPanel) {
    console.log(formData, 'data');
    console.log(formData.valid, 'valid');
    let applyform = new Leave();
    applyform = formData.value;
    let user = new User();
    user.id = this.userId;
    applyform.request_by = user;
    applyform.man_days = this.man_days;
    this.isValidMandays = true;
    console.log(applyform.leave_type.name, applyform.man_days, this.leaveDetails.rem_short_leaves, 'data');
    if (applyform.leave_type.name === LeaveTypeName.Annual_leave && Number(applyform.man_days) > Number(this.leaveDetails.rem_annual_leaves)) {
      this.isValidMandays = false;
      this.message.add({
        severity: 'info',
        summary: 'Remaining annual leaves are less than submitted value',
        detail: '',
      });

    }
    else if (applyform.leave_type.name === LeaveTypeName.Casual_leave && Number(applyform.man_days) > Number(this.leaveDetails.rem_casual_leaves)) {
      this.isValidMandays = false;
      this.message.add({
        severity: 'info',
        summary: 'Remaining casual leaves are less than submitted value',
        detail: '',
      });
    }
    else if (applyform.leave_type.name === LeaveTypeName.Medical_leave && Number(applyform.man_days) > Number(this.leaveDetails.rem_sick_leaves)) {
      this.isValidMandays = false;
      this.message.add({
        severity: 'info',
        summary: 'Remaining medical leaves are less than submitted value',
        detail: '',
      });
    }
    else if (applyform.leave_type.name === LeaveTypeName.Short_leave && Number(applyform.man_days) > Number(this.leaveDetails.rem_short_leaves)) {
      this.isValidMandays = false;
      this.message.add({
        severity: 'info',
        summary: 'Remaining short leaves are less than submitted value',
        detail: '',

      });
    }
    // applyform.leave_starting_date=moment( moment(applyform.leave_starting_date).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS))
    // applyform.leave_end_date=moment( moment(applyform.leave_end_date).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS))
    // console.log(moment( moment(applyform.leave_starting_date).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS)), 'newdate');
    if (this.isValidMandays && formData.valid) {
      
      this.confirmationService.confirm({
        message: 'Are you sure you want to request the leave?',
        header: 'Confirmation',
        acceptIcon: 'icon-not-visible',
        rejectIcon: 'icon-not-visible',
        accept: async () => {
          if(this.uploadedImgFile){
            const filename=await this.leavesControllerServiceProxy
            .addLeavedDcument({
              data: this.uploadedImgFile,
              fileName:
              user.id+"_" + applyform.leave_type.name+"_"+
                '.' +
                this.uploadedImgFile.name.split('.').pop(),
            }).toPromise();
           applyform.doc_url= this.baseUrl+'/leave_documents/'+filename.filename;
           
          }

          this.leavesControllerServiceProxy.saveLeaves(applyform).subscribe(
             (res) => {
              
              this.changeLeaveStatusForMyLeaveList(LeaveStatuses.PENDING);
              this.showLeaveDetails();
              this.message.add({
                severity: 'success',
                summary: 'Leave successfully submitted',
                detail: '',
              });
              op.hide();
              formData.reset();
              // this.showLeaveDetails();
            },
            (error) => {
              this.message.add({ severity: 'info', summary: error, detail: '' });
            }
          );
        },
        reject: () => { },
      });


    }
    else if (!formData.valid) {

      this.message.add({
        severity: 'info',
        summary: 'Required fields are missing ',
        detail: '',
      });
    }
  }
  showLeaveDetails() {
    this.leavesControllerServiceProxy
      .getLeavedetails(this.userId)
      .subscribe((res) => {
        console.log('leaveDetails', res);
        this.leaveDetails = res;

      });

  }
  changeLeaveStatusForMyLeaveList(status: LeaveStatuses) {
    this.changedLeaveStatusForMyLeaveList = status;

    this.selectedLeaveTypeforMyLeaveList = new LeaveType();

    this.selectedLeaveTypeforMyLeaveList.id = 0;
    this.getLeavesForMyLeaveList();
  }
  getLeavesForMyLeaveList() {
    this.myLeaveList = [];

    this.leavesControllerServiceProxy
      .getMyLeaves(
        0,
        0,
        this.changedLeaveStatusForMyLeaveList,
        this.userId,
        this.selectedLeaveTypeforMyLeaveList.id
      )
      .subscribe((res) => {
        this.myLeaveList = res.items;
        console.log('asd', this.loggedUserHigherGroup, this.myLeaveList);
      });
  }

  onChangeLeaveType() {
    console.log("leave_type", this.leave_type)
    this.buttonDisabled = false;
    if (this.leave_type.name === LeaveTypeName.Annual_leave) {
      this.remainingLeaveType = this.leaveDetails.rem_annual_leaves
      if ((this.leaveDetails.rem_annual_leaves) < 0) {
        this.buttonDisabled = true;
      }
    }
    else if(this.leave_type.name === LeaveTypeName.Casual_leave){
      this.remainingLeaveType  = this.leaveDetails.rem_casual_leaves 
      if((this.leaveDetails.rem_casual_leaves)<0){
        this.buttonDisabled = true;
      }
    }
    // else if(this.leave_type.name === LeaveTypeName.Half_day_leave){
    //    this.remainingLeaveType  = this.leaveDetails.rem_casual_leaves*2 ;
    //    if((this.leaveDetails.rem_casual_leaves)<0){
    //     this.buttonDisabled = true;
    //   }
    // }
    else if (this.leave_type.name === LeaveTypeName.Maternity_leave) {
      this.remainingLeaveType = this.leaveDetails.rem_maternal_leaves;
      if ((this.leaveDetails.rem_maternal_leaves) < 0) {
        this.buttonDisabled = true;
      }
    }
    else if (this.leave_type.name === LeaveTypeName.Medical_leave) {
      this.remainingLeaveType = this.leaveDetails.rem_sick_leaves
      if ((this.leaveDetails.rem_sick_leaves) < 0) {
        this.buttonDisabled = true;
      }
    }
    else if (this.leave_type.name === LeaveTypeName.Short_leave) {
      this.remainingLeaveType = this.leaveDetails.rem_short_leaves
      if ((this.leaveDetails.rem_short_leaves) < 0) {
        this.buttonDisabled = true;
      }
    }


  }
  getLogo(): any {}
  onAddFile(event: { index: number; file: File }) {
    this.uploadedImgFile = event.file;
  }

  onRemoveFile(event: { id: number | undefined; index: number; file: any }) {
    // this.uploadedImgFile = undefined;
  }
}
