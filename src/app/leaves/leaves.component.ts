import { Component, OnInit } from '@angular/core';
import { AppService, LeaveStatuses } from 'src/shared/AppService';
import { ConfirmationService, MessageService } from 'primeng/api';

import {
  GroupName,
  Leave,
  LeavesControllerServiceProxy,
  LeaveCalc,
  LeaveStatus,
  LeaveType,
  LeaveTypeName,
  User,
  UserControllerServiceProxy,
} from 'src/shared/service-proxies/service-proxies';
import { delay } from 'rxjs';
import * as moment from 'moment';
import { OverlayPanel } from 'primeng/overlaypanel';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss'],
})
export class LeavesComponent implements OnInit {
  name: string[] = [];
  employee:User;
  products: any = [];
  leavetypes: LeaveType[] = [];
  leavetypesForRequest: LeaveType[] = [];
  leavetypesForMyList: LeaveType[] = [];
  displayResponsive: boolean = false;
  leave_type: any;
  buttonDisabled: boolean = false;
  remainingLeaveType: any;

  leave_starting_date: any;
  leave_end_date: any;
  reason: any;
  tl_respond_by: any;
  man_days: any;

  leaveType: string = 'Approved by';
  adminLeaveType: string = 'Approved by';
  selectedName: string = '';
  showMoreOptions: boolean = false;
  actualTarget: any;
  isRequestMode: boolean = false;
  userId!: number;
  leaveDetails: LeaveCalc;
  leaveSummary: LeaveCalc[];
  selectedLeaveSummary: LeaveCalc;
  user: string = 'CEO'; // CEO, teamLead
  isCEO: boolean = false;
  isHOD: boolean = false;
  isTL: boolean = false;
  selectedUserLeaveSummary:LeaveCalc;

  myLeaveList: Leave[] = [];
  selectedLeave!: Leave;
  selectedLeaveTypeforMyLeaveList: LeaveType = new LeaveType();
  changedLeaveStatusForMyLeaveList: LeaveStatuses = LeaveStatuses.PENDING;

  isView: boolean = true;
  requestedLeaveList: Leave[] = [];
  loggedUserHigherGroup!: GroupName | null;
  loggedUserGroups!: GroupName[];
  userList: User[] = [];
  selectedUserforApproval: User = new User();
  selectedLeaveTypeforApproval: LeaveType = new LeaveType();
  changedLeaveStatusForAprroval: LeaveStatuses = LeaveStatuses.PENDING;
  feedbcak: string = '';
  isValidMandays: boolean = true;

  imageUrl: string = '';
  uploadedImgFile: File;
  target = LeaveTypeName.NoPay_leaveUnauthorized;
  private readonly baseUrl: string = "";
  
  noPayUnauthorized=LeaveTypeName.NoPay_leaveUnauthorized;
  noPayrequestedBy= new User();
  constructor(
    private appService: AppService,
    private leavesControllerServiceProxy: LeavesControllerServiceProxy,
    private userControllerServiceProxy: UserControllerServiceProxy,
    private message: MessageService,
    private confirmationService: ConfirmationService,
    
  ) {
    this.baseUrl = environment.baseUrlAPI
    // this.name = ['type1','type2','type3' ];
  }
  public get LeaveStatuses() {
    return LeaveStatuses;
  }
  public get GroupName() {
    return GroupName;
  }

  showResponsiveDialog() {
    this.displayResponsive = true;
  }

  ngOnInit(): void {
    this.userId = Number(this.appService.getProfileId());
    console.log("id", this.userId)
    this.loggedUserHigherGroup = this.appService.getHigherGroup();
    this.loggedUserGroups = this.appService.getGroups();
    this.isCEO = this.appService.isCEO();
    this.isHOD = this.appService.isHOD();
    this.isTL = this.appService.isTeamLead();
    if (this.loggedUserHigherGroup) {
      this.selectedUserforApproval.id = 0;
      this.selectedUserforApproval.first_name = 'All'
      this.selectedLeaveTypeforApproval.id = 0;
      this.selectedLeaveTypeforApproval.name = LeaveTypeName.All;
      this.getLeaveToLeaveTypeForApprove();
    }
    if (!this.isCEO) {
      this.selectedLeaveTypeforMyLeaveList.id = 0;
      this.selectedLeaveTypeforMyLeaveList.name = LeaveTypeName.All;
      this.getLeavesForMyLeaveList();
      this.showLeaveDetails();
    }


    this.leavesControllerServiceProxy.getLeaveTypes(this.userId).subscribe((res) => {
      
      this.leavetypes.push(this.selectedLeaveTypeforApproval)
      this.leavetypes.push(...res);
      this.leavetypesForRequest = res.filter(x => x.name !== this.target);
      this.leavetypesForMyList.push(this.selectedLeaveTypeforMyLeaveList)
      this.leavetypesForMyList.push(...res);


    });
    this.userControllerServiceProxy.getALlUsers().subscribe((res) => {
      this.userList.push(this.selectedUserforApproval)
      this.userList.push(...res);
    });

    this.leavesControllerServiceProxy.getAllLeaveSummary().subscribe((res) => {
      this.leaveSummary = res;
      console.log(this.leaveSummary, 'leaveSummary');
      
    })

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
    else if (this.leave_type.name === LeaveTypeName.Casual_leave) {
      this.remainingLeaveType = this.leaveDetails.rem_casual_leaves
      if ((this.leaveDetails.rem_casual_leaves) < 0) {
        this.buttonDisabled = true;
      }
    }
    // else if (this.leave_type.name === LeaveTypeName.Half_day_leave) {
    //   this.remainingLeaveType = this.leaveDetails.rem_casual_leaves * 2;
    //   if ((this.leaveDetails.rem_casual_leaves) < 0) {
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
  showLeaveDetails() {
    this.leavesControllerServiceProxy
      .getLeavedetails(this.userId)
      .subscribe((res) => {
        console.log('leaveDetails', res);
        this.leaveDetails = res;

      });


  }

  // showLeaveType(type: string) {
  //   this.leaveType = type;
  // }
  showAdminLeaveType(type: string) {
    this.adminLeaveType = type;
  }
  changeLeaveStatusForApproval(status: LeaveStatuses) {
    this.changedLeaveStatusForAprroval = status;
    this.selectedUserforApproval = new User();
    this.selectedLeaveTypeforApproval = new LeaveType();
    this.selectedUserforApproval.id = 0;
    this.selectedLeaveTypeforApproval.id = 0;
    this.getLeaveToLeaveTypeForApprove();
  }

  getLeaveToLeaveTypeForApprove() {

    console.log('selectedUserforApproval', this.selectedUserforApproval)
    console.log('this.selectedLeaveTypeforApproval', this.selectedLeaveTypeforApproval)
    this.requestedLeaveList = [];
    let groupNames: GroupName[] = [];
    if (
      this.loggedUserHigherGroup == GroupName.CEO ||
      this.loggedUserHigherGroup == GroupName.HOD
    ) {
      groupNames.push(this.loggedUserHigherGroup);
    } else if (this.loggedUserHigherGroup == GroupName.TEAM_LEAD) {
      groupNames = this.loggedUserGroups.filter(
        (a) => a != GroupName.TEAM_LEAD
      );
    }
    for (let groupName of groupNames)
      this.leavesControllerServiceProxy
        .getLeavesForApproval(
          0,
          0,
          this.changedLeaveStatusForAprroval,
          groupName.toString(),
          this.selectedUserforApproval.id,
          this.selectedLeaveTypeforApproval.id
        )
        .subscribe((res) => {
          this.requestedLeaveList.push(...res.items);
          console.log(this.loggedUserHigherGroup, this.requestedLeaveList);
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
  // showMore(){
  //   this.showMoreOptions = true;
  // }
  showRequestLeave() {
    this.isRequestMode = true;
    console.log('dddd');
  }
  removeRequestLeave() {
    this.isRequestMode = false;
    console.log('ssss');
  }
  async onSubmit(formData: NgForm, op: OverlayPanel,isabsencence:boolean) {

    let user = new User();
    console.log(formData, 'data');
    console.log(formData.valid, 'valid');
    let applyform = new Leave();
    applyform = formData.value;
    console.log(applyform, 'applyform');

    if(isabsencence===true){
      console.log("isabsencence")
      user.id=this.employee.id;
      applyform.leave_type =this.leavetypes.find(x => x.name === LeaveTypeName.NoPay_leaveUnauthorized )!
      applyform.request_by = user;
      this.userControllerServiceProxy.getUserById(this.userId).subscribe(
        (res) => {
          applyform.no_pay_leave_request_by =res;
          
        })
      

    }
    else{
      
    
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
   

    }
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
              console.log(applyform, "submitted leave")
              this.changeLeaveStatusForMyLeaveList(LeaveStatuses.PENDING);
              op.hide();
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

  cancelPendingMyLeaves(leave: Leave) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel?',
      header: 'Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.deletePendingMyLeave(leave);
      },
      reject: () => { },
    });
  }

  deletePendingMyLeave(leave: Leave) {
    this.leavesControllerServiceProxy.remove(leave).subscribe(a => {
      this.showLeaveDetails();
      this.changeLeaveStatusForMyLeaveList(LeaveStatuses.PENDING);
      this.message.add({
        severity: 'success',
        summary: 'Leave successfully deleted',
        detail: '',
      });

    }, err => {
      this.message.add({ severity: 'error', summary: err, detail: '' });
    })
  }
  selectMyLeave(leave: Leave, isView: boolean) {
    console.log(leave,"ss");
    this.isView = isView;
    console.log(this.isView);
    this.selectedLeave = leave;
  }

  isChangeLeaveStatus(leaveStatus: LeaveStatuses,op:OverlayPanel) {
    this.confirmationService.confirm({
      message: 'Are you sure about this status?',
      header: 'Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.changeLeaveStatus(leaveStatus,op);
        op.hide();
        
        
      },
      reject: () => { },
    });
    
  }
  async changeLeaveStatus(leaveStatus: LeaveStatuses,leaveDetail:OverlayPanel) {
    console.log(leaveStatus)

    const leaveStatusObject: LeaveStatus | undefined = await this.leavesControllerServiceProxy.getLeaveStatusByValue(leaveStatus).toPromise();
    console.log('leaveStatusObject', this.selectedLeave)
    if (leaveStatus != LeaveStatuses.REJECT || this.feedbcak) {
      if (leaveStatusObject) {
        const tempLeaveState = new LeaveStatus();
        tempLeaveState.id = leaveStatusObject.id;
        tempLeaveState.value = leaveStatusObject.value;
        const tempUser = new User();
        tempUser.id = this.userId;
        if (this.loggedUserHigherGroup == GroupName.CEO) {
          this.selectedLeave.final__state = tempLeaveState;
          this.selectedLeave.final_state_feedback = this.feedbcak;
          this.selectedLeave.final_respond_by = tempUser;
        } else if (this.loggedUserHigherGroup == GroupName.HOD) {
          this.selectedLeave.hod_recommendation_state = tempLeaveState;
          this.selectedLeave.hod_recommendation_feedback = this.feedbcak;
          this.selectedLeave.hod_respond_by = tempUser;
        }
        else if (this.loggedUserHigherGroup == GroupName.TEAM_LEAD) {
          this.selectedLeave.tl_recommendation_state = tempLeaveState;
          this.selectedLeave.tl_recommendation_feedback = this.feedbcak
          this.selectedLeave.tl_respond_by = tempUser;
        }

        this.leavesControllerServiceProxy.changeLeaveStatus(this.selectedLeave).subscribe(res => {
          //  if(!this.selectedUserforApproval){
          this.selectedUserforApproval = new User();
          this.selectedUserforApproval.id = 0;
          //  }

          this.selectedLeaveTypeforApproval = new LeaveType();
          this.selectedLeaveTypeforApproval.id = 0;
          this.getLeaveToLeaveTypeForApprove();
          this.feedbcak='';
          leaveDetail.hide();
          this.message.add({
            severity: 'success',
            summary: 'Leave successfully updated',
            detail: '',
          });
          this.feedbcak =''
          
        }
          , err => {
            console.log(err)
            this.message.add({ severity: 'error', summary: "error in Updated", detail: err });

          }
        )
      } else {

        this.message.add({ severity: 'error', summary: "erro in set Leave status", detail: '' });
      }

    } else {
      this.message.add({ severity: 'error', summary: "rejection failed", detail: "plase give reason for rejection" });
    }


  }
  selectedEmployerSumary(id:number){
    console.log(id)
    this.leavesControllerServiceProxy.getLeavedetails(id).subscribe((res) => {
      this.selectedUserLeaveSummary = res;
      console.log("selecteduser",res)
    })

  }
  scroll(id: any) {
    let el:any = document.getElementById(id);
    el.scrollIntoView();
  }
  getLogo(): any {}
  onAddFile(event: { index: number; file: File }) {
    this.uploadedImgFile = event.file;
  }

  onRemoveFile(event: { id: number | undefined; index: number; file: any }) {
    // this.uploadedImgFile = undefined;
  }
}
