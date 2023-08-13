import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppService, LoginRole } from 'src/shared/AppService';
import { AuthControllerServiceProxy, AuthCredentialDto, UserControllerServiceProxy } from 'src/shared/service-proxies/service-proxies';
import decode from "jwt-decode";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public passwordType: string = "password";
  public isSubmitted: boolean=false;
  public email: string="";
  public password: string="";

  ref!: DynamicDialogRef;
  constructor(
    protected messageService: MessageService,
    private router: Router,
    private authControllerServiceProxy: AuthControllerServiceProxy,
    private appService: AppService,
    private activatedRoute:ActivatedRoute,
    private usersControllerServiceProxy: UserControllerServiceProxy,
    public dialogService: DialogService
  ) { }

  ngOnInit(): void {
  }

  togglePassword(){
    if (this.passwordType=="text"){
      this.passwordType="password"
    }else {
      this.passwordType="text";
    }
  }

  showPasswordResetForm() {
    this.router.navigate(['../forgot'], {relativeTo:this.activatedRoute});
  }

  async login(form: NgForm) {
    const a = new AuthCredentialDto();
    if(!this.password  || !this.email){
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Fill All the fields',
        closable: true,
      });
    }else{
      a.password = this.password;
      a.email = this.email;
      let res:any;
      try{
         res = await this.authControllerServiceProxy.login(a).toPromise();
      console.log(res)
       const tocken_data= decode<any>(res.access_token);

        this.appService.setToken(res.access_token);
        // this.appService.steRefreshToken(res.refreshToken);
        this.appService.setRole(tocken_data.role);
        this.appService.setProfileId(tocken_data.id);
        this.appService.setFirstName(tocken_data.fname);
        this.appService.setLastName(tocken_data.lname);
        this.appService.setGroups(tocken_data.group);
        // this.appService.startRefreshTokenTimer();
        // this.appService.startIdleTimer();
        this.router.navigate(['../../app'], {});
      
      }catch(err){
        console.error('errasdadsso',err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: res.error,
          closable: true,
        });
      }
    }
  }






}
