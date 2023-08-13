import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';



import { UserIdleService } from "angular-user-idle";
import { ConfirmationService } from 'primeng/api';
import { GroupName, User } from './service-proxies/service-proxies';


export enum RecordStatus {
  Deleted = -20,
  InActive = -10,
  Active = 0,
}

export enum LocalData {
  pData = "PROJECT_DATA"
}

export enum LoginRole {
  MASTER_ADMIN = "MASTER_ADMIN",
  CSI_ADMIN = "CSI_ADMIN",
  ORG_ADMIN = "ORG_ADMIN",
  ORG_USER = "ORG_USER",
  AUDITOR = "AUDITOR",
  DEO = "DEO",
  EF_MANAGER = "EF_MANAGER"
}

export enum AuthData {
  ACCESS_TOKEN = "ACCESS_TOKEN",
  REFRESH_TOKEN = "REFRESH_TOKEN",
  LOGIN_PROFILE_ID = "LOGIN_PROFILE_ID",
  EMAIL = "EMAIL",
  FIRST_NAME = "FIRST_NAME",
  LAST_NAME = "LAST_NAME",
  ROLES = "ROLE",
  GROUPS = "GROUPS",
  TYPE = "TYPE",
}




export enum ProfileStatus {
  InActive = -10,
  Active = 0,
  Resetting = 1,
  BlockedByWrongAttemps = 2,
  OTPValidated = 3,
  OTPFailed = 4
}

export enum LeaveStatuses {
  PENDING = 0,
  APPROVED = 1,
  REJECT = -1
}
@Injectable({
  providedIn: 'root',
})
export class AppService {

  loadingSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  enableSpinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /**
   * Contains in-progress loading requests
   */
  loadingMap: Map<string, boolean> = new Map<string, boolean>();
  enableSpinnerMap: Map<string, boolean> = new Map<string, boolean>();

  private _isAuthenticated: boolean;
  public isDataupdated = new BehaviorSubject<boolean>(true);
  private refreshTokenTimeout: any;

  public parameterUnits: any;
  constructor(
    private confirmationService: ConfirmationService,
    private userIdle: UserIdleService,
    private router: Router,


  ) {
    const token = this.getToken();
    this._isAuthenticated = token !== null;

  }

  getMonths() {

  }

  public forbiddenAction() {
    this.confirmationService.confirm({
      message: 'Please login with premited user account ',
      header: 'You don\'t have access to this resources',
      acceptIcon: 'icon-not-visible',
      acceptLabel: 'Try with another user',
      rejectLabel: 'Cancel',
      accept: () => {
        this.userIdle.resetTimer();
        this.userIdle.stopWatching();
        this.logout();
      },
      reject: () => {

      }
    });
  }

  public startIdleTimer() {
    this.userIdle.resetTimer();
    this.userIdle.stopWatching();
    this.userIdle.setConfigValues({ idle: 9000, timeout: 1, ping: 6000, idleSensitivity: 100 });

    /*Session logout */
    this.userIdle.startWatching(); //Start watching for user inactivity.
    this.userIdle.onTimerStart().subscribe((count: any) => { });
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      // show dialog
      this.confirmationService.confirm({
        message: 'Please login again ',
        header: 'Session expired',
        acceptIcon: 'icon-not-visible',
        acceptLabel: 'Ok',
        rejectVisible: false,
        accept: () => {
          this.userIdle.resetTimer();
          this.userIdle.stopWatching();
          this.logout();
        },
        reject: () => {
          this.userIdle.resetTimer();
          this.userIdle.stopWatching();
          this.logout()
        }
      });
    });
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  public startRefreshTokenTimer(time = null) {
    const token = this.getToken();
    if (token) {

    }
  }

  private refreshToken() {

  }

  async getUser(): Promise<User | null> {


    return null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return this._isAuthenticated;
  }

  logout() {
    this.clearData();
    this.stopRefreshTokenTimer();
    this.router.navigate(['auth/login']);
  }

  private clearData() {
    localStorage.clear();
  }

  update() {
    this.isDataupdated.next(true);
  }



  setToken(tocken: string): void {
    localStorage.setItem(AuthData.ACCESS_TOKEN, tocken)
    const token = this.getToken();
    this._isAuthenticated = token !== null;
  }

  getToken(): string | null {
    return localStorage.getItem(AuthData.ACCESS_TOKEN);
  }

  setRole(role: string): void {
    localStorage.setItem(AuthData.ROLES, role)
  }
  getRole(): string | null {
    return localStorage.getItem(AuthData.ROLES);
  }
  setGroups(groups: GroupName[]): void {
    localStorage.setItem(AuthData.GROUPS, groups.join(","))
  }

  getGroups(): GroupName[] {
    const groupstr = localStorage.getItem(AuthData.GROUPS);
    if(groupstr){
      return groupstr?.split(",") as unknown  as GroupName[];
    }else{
      return [];
    }
  }

  steRefreshToken(tocken: string): void {
    localStorage.setItem(AuthData.REFRESH_TOKEN, tocken)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(AuthData.REFRESH_TOKEN);
  }

  setFirstName(firstNsme: string): void {
    localStorage.setItem(AuthData.FIRST_NAME, firstNsme)
  }
  setLastName(lastName: string): void {
    localStorage.setItem(AuthData.LAST_NAME, lastName)
  }
  getFirstName(): string | null {
    return localStorage.getItem(AuthData.FIRST_NAME);
  }
  getLastName(): string | null {
    return localStorage.getItem(AuthData.LAST_NAME);
  }
  setEmail(email: string): void {
    localStorage.setItem(AuthData.EMAIL, email)
  }

  getEmail(): string | null {
    return localStorage.getItem(AuthData.EMAIL);
  }
  setProfileId(profileId: string): void {
    localStorage.setItem(AuthData.LOGIN_PROFILE_ID, profileId)
  }

  getProfileId(): string | null {
    
    return localStorage.getItem(AuthData.LOGIN_PROFILE_ID);
    
  }




  /**
   * Sets the loadingSub property value based on the following:
   * - If loading is true, add the provided url to the loadingMap with a true value, set loadingSub value to true
   * - If loading is false, remove the loadingMap entry and only when the map is empty will we set loadingSub to false
   * This pattern ensures if there are multiple requests awaiting completion, we don't set loading to false before
   * other requests have completed. At the moment, this function is only called from the @link{HttpRequestInterceptor}
   * @param loading {boolean}
   * @param url {string}
   */
  setLoading(loading: boolean, url: string): void {
    if (!url) {
      throw new Error('The request URL must be provided to the LoadingService.setLoading function');
    }
    if (loading) {
      this.loadingMap.set(url, loading);
      this.loadingSub.next(true);
    } else if (!loading && this.loadingMap.has(url)) {
      this.loadingMap.delete(url);
    }
    if (this.loadingMap.size === 0) {
      this.loadingSub.next(false);
    }
  }

  setEnableSpinner(enabled: boolean, url: string): void {
    // if (!url) {
    //   throw new Error('The request URL must be provided to the ApService.setEnableSpinner function');
    // }
    if (enabled) {
      this.enableSpinnerMap.set(url, enabled);
      this.enableSpinner.next(true);
    } else if (!enabled && this.enableSpinnerMap.has(url)) {
      this.enableSpinnerMap.delete(url);
    }
    if (this.enableSpinnerMap.size === 0) {
      this.enableSpinner.next(false);
    }
  }

  listenToSpinner() {
    return this.enableSpinner.asObservable();
  }






  isCEO() {
    let groups = this.getGroups();
    return groups.some(rr => rr === GroupName.CEO)
  }

  isHOD() {
    let groups = this.getGroups();
    return groups.some(rr => rr === GroupName.HOD)
  }

  isTeamLead() {
    let groups = this.getGroups();
    return groups.some(rr => rr === GroupName.TEAM_LEAD)
  }

  getHigherGroup():GroupName|null{
    let groups = this.getGroups();
    if(groups.some(rr => rr === GroupName.CEO)){
      return  GroupName.CEO
    }else if(groups.some(rr => rr === GroupName.HOD)){
      return  GroupName.HOD

    }
    else if(groups.some(rr => rr === GroupName.TEAM_LEAD)){
      return  GroupName.TEAM_LEAD
      
    }

      return null
    
    
  }
  
 



  getYear(isFy: boolean, year: number | string, fyFrom: moment.Moment, fyTo: moment.Moment, isAllMonth: boolean = false) {
    console.log(isFy, year, fyFrom, fyTo, isAllMonth);
    if (!isFy) {
      return year as number;
    } else {
      if (isAllMonth) {
        if ((12 - fyFrom.month()) >= fyTo.month()) {
          return fyFrom.year();
        } else {
          return fyTo.year();
        }
      } else {
        const date = new Date();
        // date.setFullYear() // TODO: change with month
        return date.getFullYear();
      }
    }
  }








}
