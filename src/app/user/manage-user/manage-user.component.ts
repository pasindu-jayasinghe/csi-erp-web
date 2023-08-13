import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import {
  Group,
  GroupUser,
  Role,
  User,
  UserControllerServiceProxy,
  UserEmployee_types,
  UserGender,
  UserMaritial_status,
} from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss', '../user.component.scss'],
})
export class ManageUserComponent implements OnInit {
  user: User = new User();
  imageUrl: string = '';
  employeeTypes: any[] = Object.values(UserEmployee_types);
  genderList: any = Object.values(UserGender);
  private readonly baseUrl: string = "";
  maritial_statuses: any = Object.values(UserMaritial_status);
  departmentList: Group[] = [];
  selectedDepartmentList: Group[] = [];
  rolelist: Role[] = [];
  uploadedImgFile: File;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userControllerServiceProxy: UserControllerServiceProxy,
    private confirmationService: ConfirmationService,
    private message: MessageService
  ) {
    this.baseUrl = environment.baseUrlAPI
  }

  async ngOnInit(): Promise<void> {
    let depart = await this.userControllerServiceProxy
      .getAllGroups()
      .toPromise();
    this.departmentList = depart ? depart : [];
    const id = this.activatedRoute.snapshot.queryParamMap.get('id');
    if (id) {
      // console.log("edit",id,Number(id))
      this.userControllerServiceProxy
        .getUserById(Number(id))
        .subscribe((res) => {
          console.log(res);
          this.user = res;
          
          //@ts-ignore
          this.user.bOD = new Date( moment(this.user.bOD).format("YYYY-MM-DD HH:mm:ss"));
             //@ts-ignore
          this.user.starting_date = new Date(moment(this.user.starting_date).format("YYYY-MM-DD HH:mm:ss"));
          this.selectedDepartmentList.push(
            ...this.departmentList.filter((a) => {
              return res.groupUser.some((b) => b.group.id == a.id);
            })
          );

          // console.log("add",this.user.bOD.format('yyyy-MM-DD'))
          // this.user.bOD=moment(this.user.bOD.format('yyyy-MM-DD'))
        });
    } else {
      console.log('add');
    }

    this.userControllerServiceProxy.getAllRoles().subscribe((res) => {
      this.rolelist = res;
    });
  }

  async onSubmit1(test: NgForm) {
    console.log(test.valid)
    console.log(test)
  }
  async onSubmit(test: NgForm) {


    // console.log('work', this.user);
    // console.log('test.valid', test);
    // console.log('test.valid', test.valid);
    if(test.valid){
    this.confirmationService.confirm({
      message: 'Are you sure you want to submit?',
      header: 'Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: async () => {
    const tempGroupUsers: GroupUser[] = [];
    for (let group of this.selectedDepartmentList) {
      const tempGroupUser: GroupUser = new GroupUser();
      tempGroupUser.group.id = group.id;
      tempGroupUsers.push(tempGroupUser);
    }
    if(this.uploadedImgFile){
      const filename=await this.userControllerServiceProxy
      .addUserLogo({
        data: this.uploadedImgFile,
        fileName:
          this.user.first_name +
          '.' +
          this.uploadedImgFile.name.split('.').pop(),
      }).toPromise();
     this.user.logo_url= this.baseUrl+'/user/'+filename.filename;
    }
   

     this.user.groupUser=tempGroupUsers;
      this.userControllerServiceProxy.addUser(this.user).subscribe(res=>{
        console.log('res', res);
        this.message.add({
          severity: 'success',
          summary: `User successfully ${this.user.id?'updated':'submitted'}`,
          detail: '',
        });
        this.router.navigate(['../list'], { relativeTo: this.activatedRoute });
      })
      },
      reject: () => {

       },
    });
    }
    else{
      this.message.add({
        severity: 'info',
        summary: 'fill all inputs befor submission',
        detail: '',
      });

    }
  }

  getLogo(): any {}

  onAddFile(event: { index: number; file: File }) {
    this.uploadedImgFile = event.file;
  }

  onRemoveFile(event: { id: number | undefined; index: number; file: any }) {
    // this.uploadedImgFile = undefined;
  }
  back() {
    this.router.navigate(['../list'], { relativeTo: this.activatedRoute });
  }
}
