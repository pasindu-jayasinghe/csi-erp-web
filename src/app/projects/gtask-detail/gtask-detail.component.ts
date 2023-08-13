import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppService } from 'src/shared/AppService';
import { GeneralTask, GeneralTaskControllerServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-gtask-detail',
  templateUrl: './gtask-detail.component.html',
  styleUrls: ['./gtask-detail.component.scss']
})
export class GtaskDetailComponent implements OnInit {

  userId:number
  userRole:string | null
  bVisible:boolean = false
  isView:boolean = false
  gTask:GeneralTask
  editEntryId:number


  constructor(

    protected messageService: MessageService,
    private appService: AppService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private gtaskSericeProxy: GeneralTaskControllerServiceProxy,


  ) { }

  async ngOnInit(): Promise<void> {

    
    this.userId = Number(this.appService.getProfileId());
    this.userRole = this.appService.getRole() 
    if(this.userRole == "CEO"){
      this.bVisible = true
    }


    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.editEntryId = parseInt(id);
      await this.gtaskSericeProxy.getgTaskById(+id).subscribe(res => {
        this.gTask = res;
      })

    }

    this.route.url.subscribe(r => {
    if (r[0].path.includes("view")) {
      this.isView = true;
    }
  });
  }

  async send() {

    let res = await this.gtaskSericeProxy.updateFeedBack(this.editEntryId, this.gTask.csiFeedBack).toPromise()
    if(res){
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'sent feedback successfully',
        closable: true,
      });

    }
    else{
      console.log("ERROR SENT FEED BACK")
    }


  }

  back(){

    this.router.navigate(['../work-plan-list'], { queryParams: {  }, relativeTo: this.activatedRoute });
 
  }

}
