import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AppService } from 'src/shared/AppService';
import { User, UserControllerServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss','../user.component.scss']
})
export class UserViewComponent implements OnInit {
  isShowBack:boolean=false;
  newPassword:string;
  user: User = new User();
  visibleDialog:boolean=false;
  userId:number;
  disablePasswordButton:boolean=false;
  constructor( private appService: AppService,  private router: Router,
    private activatedRoute: ActivatedRoute, private confirmationService: ConfirmationService,
    private userControllerServiceProxy: UserControllerServiceProxy) { }

  ngOnInit(): void {

    const id = this.activatedRoute.snapshot.queryParamMap.get('id');
    this.userId=Number(id);
    const fromList = this.activatedRoute.snapshot.queryParamMap.get('fromList');
    if(fromList){
      this.isShowBack=true;
    }
    if(id){
      // console.log("edit",id,Number(id))
      this.userControllerServiceProxy.getUserById(Number(id)).subscribe(res=>{
        console.log(res)
this.user=res;

      })
    }else{
      console.log("add")

    }
  }




  getLogo(): any {}

  onAddFile(event: { index: number; file: File }) {}

  onRemoveFile(event: { id: number | undefined; index: number; file: any }) {}
  back() {
    this.router.navigate(['../list'], { relativeTo: this.activatedRoute });
  }

  changePasword(){
    this.disablePasswordButton=true;
    this.confirmationService.confirm({
      message: 'Are you sure you want a new Password?',
      header: 'Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
       this.userControllerServiceProxy.getNewPassword(this.userId).subscribe(res=>{

        this.newPassword=res.password;
        this.visibleDialog=true;
        this.disablePasswordButton=false;
       })
      },
      reject: () => {
        this.disablePasswordButton=false;
       },
    });
   
  }
}
