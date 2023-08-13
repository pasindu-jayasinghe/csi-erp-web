import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { AppService } from 'src/shared/AppService';

@Component({
  selector: 'app-logged-base',
  templateUrl: './logged-base.component.html',
  styleUrls: ['./logged-base.component.scss']
})
export class LoggedBaseComponent implements OnInit {

  title = 'icat-country-portal-web-app';
  togglemenu: boolean = true;
  innerWidth = 0;
  showLeftMenu: boolean = true;
  showTopMenu: boolean = true;
  fname: any = '';
  lname: any = '';
  urole: any = '';
  anonimousId: any;
  instName: string = '';
  moduleLevels: number[] = [1];

  isCEO:boolean=false;
  userId:string|null;

  userRoles: any[] = [];
  userRole: any = { name: 'Guest', role: '-1' };

  userInactive: Subject<any> = new Subject();

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  //user idle logout code
  @HostListener('window:mousemove')
  @HostListener('document:keypress')
  refreshUserState() {
    // clearTimeout(this.userActivity);
    this.setTimeout();
  }

  /**
   *
   */
  constructor(
    private appService: AppService,
    private router: Router,
    private confirmationService: ConfirmationService,
  ) {


    

  }

  ngOnInit() {
    this.isCEO=this.appService.isCEO();
    this.fname=this.appService.getFirstName();
    this.lname=this.appService.getLastName();
    this.urole=this.appService.getRole();
    this.userId=this.appService.getProfileId();
  }


  setTimeout() {
 
  }

  getModel = (a: number): boolean => this.moduleLevels.includes(a);

  setLoginRole() {
   
  }
  //logout
  logout() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to log out?',
      header: 'Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.appService.logout();
      },
      reject: () => { },
    });
  }



  
}
