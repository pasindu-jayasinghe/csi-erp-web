import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/shared/AppService';
import { Project, ProjectControllerServiceProxy, ServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects: any[]
  viewable: boolean = true
  editable: boolean = true
  pVisible: boolean = false
  departments: any
  userId: number
  userRole: string | null
  userGroup:any
  ptext: any
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private seriviceProxy: ServiceProxy,
    private projectServiceProxy: ProjectControllerServiceProxy,
    private appService: AppService,


  ) {



  }

  async ngOnInit(): Promise<void> {
    this.userId = Number(this.appService.getProfileId());
    this.userGroup = this.appService.getGroups();

    
    console.log("iiiii",this.userGroup)
    this.userRole = this.appService.getRole()
    if (this.userRole == "CEO") { this.ptext = "All Projects" } else { this.ptext = "Project Im Involved"}

    // @ts-ignore
    this.projects = await this.projectServiceProxy.getAssignProjects(this.userId, this.userRole).toPromise();
    console.log("projects", this.projects)
    if (this.projects.length > 0) {
      this.pVisible = true

    }

  }

  new() {
    this.router.navigate(['../add'], { relativeTo: this.activatedRoute });

  }
  edit(id: number) {
    console.log("id", id)
    this.router.navigate(['../edit'], { queryParams: { id: id }, relativeTo: this.activatedRoute });
  }

  import(id: number) {
    console.log("id", id)
    this.router.navigate(['../import'], { queryParams: { id: id }, relativeTo: this.activatedRoute });
  }

  view(id: number) {
    console.log("id", id)

    this.router.navigate(['../view'], { queryParams: { id: id }, relativeTo: this.activatedRoute });
  }
}
