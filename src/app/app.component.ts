import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { delay, Subject } from 'rxjs';
import { AppService } from 'src/shared/AppService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService, DialogService],

})
export class AppComponent implements OnInit {
  title = 'icat-country-portal-web-app';
  togglemenu: boolean = true;
  innerWidth = 0;
  showLeftMenu: boolean = true;
  showTopMenu: boolean = true;
  fname: string = '';
  lname: string = '';
  urole: string = '';
  anonimousId: any;
  instName: string = '';
  moduleLevels: number[] = [1];

  userRoles: any[] = [];
  userRole: any = { name: 'Guest', role: '-1' };

  userInactive: Subject<any> = new Subject();




  loading: boolean = false;
  loadingEnabled: boolean = false;

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
  constructor(private appService: AppService,
    private router: Router,
  ) {


    

  }

  ngOnInit() {
    this.listenToLoading();
  }


  setTimeout() {
 
  }

  getModel = (a: number): boolean => this.moduleLevels.includes(a);

  setLoginRole() {
   
  }
  //logout
  logout() {
    console.log('logout-------');
    localStorage.setItem('access_token', '');
    localStorage.setItem('user_name', '');
    this.userRole = { name: 'Guest', role: '-1' };
    this.router.navigate(['/login']);
  }

  listenToLoading(): void {
    // this.appService.loadingSub.asObservable();

    this.appService.listenToSpinner().subscribe(res => {
      this.loadingEnabled = res;
    })

    this.appService.loadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
        if (this.loading) {
          // this.spinner.show()
        }else {
          // this.spinner.hide()
        }
      });
  }
}
