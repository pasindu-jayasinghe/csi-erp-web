import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NbLayoutModule, NbThemeModule } from '@nebular/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccordionModule } from 'primeng/accordion'; //accordion and accordion tab
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LeavesComponent } from './leaves/leaves.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProjectsComponent } from './projects/projects.component';
import { CardModule } from 'primeng/card';
import { ProjectFormComponent } from './projects/project-form/project-form.component';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { SharedModule } from 'src/shared/shared.module';
import { ActivityFormComponent } from './projects/activity-form/activity-form.component';
import { SubtaskFormComponent } from './projects/subtask-form/subtask-form.component';
import { TaskFormComponent } from './projects/task-form/task-form.component';
import { ProjectModule } from './projects/project.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { environment } from 'src/environments/environment';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { API_BASE_URL, AuditControllerServiceProxy, LeavesControllerServiceProxy, ServiceProxy } from 'src/shared/service-proxies/service-proxies';

import {CalendarModule} from 'primeng/calendar';
import {ProgressBarModule} from 'primeng/progressbar'
import {InputNumberModule} from 'primeng/inputnumber';

import { LoggedBaseComponent } from './logged-base/logged-base.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';

import { ToastModule } from 'primeng/toast';
import { LoggedBaseModule } from './logged-base/logged-base.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import {InputTextModule} from 'primeng/inputtext';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ErrorInterceptor } from './auth/error.interceptor';
import { UserComponent } from './user/user.component';
import { UserModule } from './user/user.module';
import { AuditComponent } from './audit/audit.component';
export function getRemoteServiceBaseUrl(): string {
  return environment.baseUrlAPI;
}

@NgModule({
  declarations: [
    AppComponent,
    LoggedBaseComponent,
    LeavesComponent,
    // ProjectsComponent,
    // ProjectFormComponent,
    ActivityFormComponent,
    SubtaskFormComponent,
    DashboardComponent,
    AuditComponent,
 
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    LoggedBaseModule,
    AuthModule,
    HttpClientModule,
    AccordionModule,
    ButtonModule,
    DropdownModule,
    BrowserAnimationsModule,
    FormsModule,
    TableModule,
    OverlayPanelModule,
    InputTextareaModule,

    CalendarModule,
    ProgressBarModule,
    CardModule,
    PanelModule,
    ToolbarModule,
    ProjectModule,
    // SharedModule,
    ToastModule,
    ProgressSpinnerModule,
    ConfirmDialogModule,
    DropdownModule,
    OverlayPanelModule,
    MessagesModule,
    InputNumberModule,
    InputTextModule,
    UserModule,
    SharedModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    ServiceProxy,
    AuditControllerServiceProxy,
    AuthGuard,
    { provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl },
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    LeavesControllerServiceProxy,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
