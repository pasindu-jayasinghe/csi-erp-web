import { DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Data, Router } from '@angular/router';
import * as moment from 'moment';
import { Moment } from 'moment';
import { MessageService, TreeNode } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { environment } from 'src/environments/environment';
import { AppService } from 'src/shared/AppService';
import { MasterDataService } from 'src/shared/master-data.service';
import { ActivitiesControllerServiceProxy, Activity, Project, ProjectControllerServiceProxy, ServiceProxy, TeamLeads, User, UserControllerServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { ActivityFormComponent } from '../activity-form/activity-form.component';
@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {



  project: Project = new Project();
  dateValue: Date = new Date();
  endDateValue: Date = new Date();
  s_project_leads: any
  uploadedImgFile: any;

  private readonly baseUrl: string = "";
  readonly imageUrl: string = "";

  isNewEntry: boolean = true;
  isView: boolean = false;
  viewable: boolean = true;
  editEntryId: number | undefined;
  isImport: boolean = false
  importProjId: number

  //*********User*********/
  teamLeads: any[] = [];
  employees: User[];
  userId: any
  userRole: any
  userView = false; // Define the userView property


  //*********Activity*********/
  activites: Activity[] = [];
  parentActivities: Activity[] = []
  selectActivity: Activity
  selectedAcitivityId: number
  clickedAct: any
  nodes: TreeNode[] = [];
  activityVisble: boolean = false
  clickedActUser: User | undefined;

  editaddChild: boolean = true;
  client_time_zone: any
  p_teamLeads: User[] = []
  public timeZones: { name: string, value: string }[] = []

  isTeamLead = false;




  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    protected userServiceProxy: UserControllerServiceProxy,
    protected messageService: MessageService,
    protected projectServiceProxy: ProjectControllerServiceProxy,
    public dialogService: DialogService,
    private activityServiceProxy: ActivitiesControllerServiceProxy,
    private serviceProxy: ServiceProxy,
    private pipe: DatePipe,
    private appService: AppService,
    private masterDataService: MasterDataService,


  ) {
    this.baseUrl = environment.baseUrlAPI
    this.imageUrl = environment.baseUrlAPI


  }

  async ngOnInit(): Promise<void> {

    this.userId = Number(this.appService.getProfileId());
    this.userRole = this.appService.getRole()
    this.timeZones = this.masterDataService.time_zones

    await this.getEmplyees();
    await this.setAction();
    await this.getActivities();


  }


  async getEmplyees() {
    let res = await this.userServiceProxy.getALlUsers().toPromise();
    this.employees = res as User[]
  }


  go(event: any) {

    console.log(event)
  }
  async setAction() {
    this.route.url.subscribe(r => {
      if (r[0].path.includes("view")) {
        this.isView = true;


      }
      if (r[0].path.includes("import")) {
        this.isImport = true;
      }

    });

    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.editEntryId = parseInt(id);
      if (this.isImport) {
        this.importProjId = +id
        this.isNewEntry = true;
        this.activityVisble = false


      } else {
        this.isNewEntry = false;
        this.activityVisble = true

      }


      let res = await this.projectServiceProxy.getProjectById(+id).toPromise();
      this.project = res as Project[0]
      console.log('sssss',this.project)


      if (this.project && this.project.teamLeads) {
        for (const lead of this.project.teamLeads) {
          if (lead.lead?.id === this.userId) {
            this.isTeamLead = true;
            break;
          }
        }
      }

      if (this.isImport) {
        this.project.id = -1
      }

      this.project.project_lead = this.employees.filter((obj) => {
        return obj.id === this.project.project_lead.id
      })[0]

      const mappedArray = this.project.teamLeads.map(item => item.lead);
      this.p_teamLeads = this.employees.filter(employee => mappedArray.some(mapped => mapped.id === employee.id));
      this.dateValue = this.project.start_date.toDate();



    }
  }
  async saveForm(projectForm: NgForm) {
    if (projectForm.valid) {

      if (this.isNewEntry) {
        this.project.start_date = moment(this.dateValue);
        this.project.end_date = moment(this.endDateValue);
        this.project.teamLeads = this.bindTeamLeads();
        const res = await this.projectServiceProxy
          .createProject(this.project).toPromise();
        if (res) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'has saved successfully',
            closable: true,
          });
          this.uploadImage(res);
          this.activityVisble = true
          this.project = res
          this.project.project_lead = this.employees.filter((obj) => {
            return obj.id === this.project.project_lead.id;
          })[0];
          const mappedArray = this.project.teamLeads.map(item => item.lead);
          this.p_teamLeads = this.employees.filter(employee => mappedArray.some(mapped => mapped.id === employee.id));
          this.getActivities()
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred, please try again',
            closable: true,
          });

        }

      } else {
        this.project.start_date = moment(this.dateValue);
        this.project.end_date = moment(this.endDateValue);
        this.project.teamLeads = this.bindTeamLeads();
        this.projectServiceProxy.updateProject(this.project.id, this.project)
          .subscribe(
            (res) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'has updated successfully',
                closable: true,
              });
              //TODO:image
            },
            (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred, please try again',
                closable: true,
              });
              console.log('Error', error);
            },
            () => {
              // this.creating = false;
            }
          );
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Required',
        detail: 'Fill All Mandatory fields',
        closable: true,
        life: 3000,
      });

    }



  }

  bindTeamLeads() {
    let team_leads: TeamLeads[] = [];
    for (var tlead of this.p_teamLeads) {
      let tl = new TeamLeads();
      tl.lead.id = tlead.id;
      tl.project.id = 1
      team_leads.push(tl);
    }
    return team_leads
  }

  uploadImage(res: any) {
    if (this.uploadedImgFile) {
      const formData = new FormData();
      formData.append('file', this.uploadedImgFile);
      this.http.post(this.baseUrl + '/project/upload-img/' + res?.id, formData).subscribe((R: any) => {
        if (R) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Img uploaded successfully',
            closable: true,
          });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error on creating` });
        }
      })
    }

  }


  getLogo() {
    if (!this.project.id) {
      return [] as { id: number, path: string, documentType: string }[]
    } else {
      return [{
        id: this.project.id,
        // path: "public" + this.project.project_logo,
        path: this.project.project_logo,

        documentType: "IMAGE"
      }]
    }
  }

  onAddFile(event: { index: number, file: File }) {
    this.uploadedImgFile = event.file;
    if (this.project.id) {
      // this.onUpload(this.project.id);
    }
  }

  onRemoveFile(event: { id: number | undefined, index: number, file: any }) {
    this.uploadedImgFile = null;
    if (this.project.id && this.project.sponsor_logo) {
      //@ts-ignore
      this.project.logopath = '';
      // this.saveForm(null);
    }
  }


  newActivity() {
    this.router.navigate(['../activity-add'], { relativeTo: this.activatedRoute });
  }

  edit(id: number) {
    console.log("id", id)
    this.router.navigate(['../activity-edit', id], { queryParams: { id: id }, relativeTo: this.activatedRoute });
  }

  view(id: number) {
    this.router.navigate(['../activity-view', id], { queryParams: { id: id }, relativeTo: this.activatedRoute });
  }
  onClickBack() {
    this.router.navigate(['app/project/list']);


  }


  //***************ActivityTreeStart*****************************************
  async getActivities() {
    console.log("pid---")

    // this.activityServiceProxy.getAllActivities().subscribe((res: any) => {
    if (this.project.id != undefined && this.project.id !== -1) {
      console.log("pid---", this.project.id)
      this.activityServiceProxy.getAllActivitiesByProjId(this.project.id).subscribe((res: any) => {
        this.activites = res
        console.log("alll", this.activites)
        this.parentActivities = this.activites.filter(a => !a.parent_activity);

      })
    }

  }

  new(data: any) {
    this.openActivityModel(data, false, null);
  }

  async import(data: any) {
    let res = await this.activityServiceProxy.copyActivitiyListByProjId(this.importProjId, this.project.id).toPromise();
    if (res) {
      this.messageService.add({
        severity: 'info',
        summary: 'Success',
        detail: 'Import Activities Successfully',
        closable: true,
      });
      this.getActivities()

    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Error on Importing Activities` });
    }
  }

  openActivityModel(activity: Activity | null | undefined, edit: boolean = false, actId: number | null) {
    const ref = this.dialogService.open(ActivityFormComponent, {
      header: activity && !edit ? 'Add child Activity to ' + activity.name : !edit ? 'Add root Activity' : 'Activity details',
      width: '50%',
      data: {
        activity: activity,
        edit: edit,
        project: this.project,
        actId: actId
        // isCSIUser: this.isCSIUser
      },
    });

    ref.onClose.subscribe(async r => {
      await this.getActivities();
      await this.onChangeActivity();
    })
  }

  async nodeSelect(event: any) {
    console.log("node----", event)
    console.log("all----", this.activites)

    let actId = event.node.id
    this.clickedAct = await this.activityServiceProxy.getActivityById(event.node.id).toPromise();
    console.log("allclickedAct", this.clickedAct)
    if (this.clickedAct.assign_to.id) {

      this.editaddChild = false

    }

    this.openActivityModel(this.clickedAct, true, actId)

  }


  async onChangeActivity() {
    this.selectedAcitivityId = this.selectActivity.id
    this.reArrange();
  }


  reArrange() {

    if (this.selectActivity) {

      this.insertNode(this.selectActivity);
      let data = this.mapObject([this.selectActivity])
      console.log("data", data)
      this.nodes = data;
    }


  }

  insertNode(parentActivity: Activity) {
    let subActivities = this.activites.filter(a => a.parent_activity?.id === parentActivity.id);
    parentActivity.childActivities = subActivities;
    parentActivity.childActivities.forEach(pA => this.insertNode(pA))

  }

  mapObject(acttivites: Activity[]): any {
    {
      return acttivites.map((val: any) => {

        return {
          id: val.id,
          label: val.name + " " + val.progress + "%",
          children: this.mapObject(val.childActivities),
          styleClass: 'custom-node ',


        }
      });

    }
  }
}


