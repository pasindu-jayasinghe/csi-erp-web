import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User, UserControllerServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  usersForCEO:User[]=[];
  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private userControllerServiceproxy: UserControllerServiceProxy,
    private confirmationService: ConfirmationService,
    private message: MessageService) {}

  ngOnInit(): void {
 this.getAllUserList();
  }
  getAllUserList(){
    this.userControllerServiceproxy.getALlUsers().subscribe(res => {
      this.usersForCEO = res;
    })
  }

  addUser() {
    this.router.navigate(['../add'], { relativeTo: this.activatedRoute });
  }
  editUser(id:number){
    this.router.navigate(['../edit'],{ queryParams: { id: id} , relativeTo: this.activatedRoute });
  }
  viewUser(id:number){
    this.router.navigate(['../view'],{ queryParams: { id: id,fromList:true } , relativeTo: this.activatedRoute });
  }
  deletUser(id:number){
    this.confirmationService.confirm({
      message: 'Are you sure you want to delet this user?',
      header: 'Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.userControllerServiceproxy.deletUser(id).subscribe(res=>{
          this.getAllUserList();
          console.log(res)
         },err=>{

          this.message.add({
            severity: 'error',
            summary: 'Erro in user deletion',
            detail: '',
          });
         })
      },
      reject: () => {
       
       },
    });
 
  }
}
