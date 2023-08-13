import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from 'src/shared/AppService';
import { GroupName } from 'src/shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor( private router: Router, private appService: AppService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
  {

    // console.log("AuthGuard")
    let authenticated = this.appService.isAuthenticated();
    // console.log("authenticated ", authenticated)
    if (!authenticated){
      this.appService.logout();
      return false;
    }



    if (route.data && route.data["groups"] !== undefined){
      const currentGroupes = this.appService.getGroups();
      let requiredRoles = route.data["groups"] as GroupName[];
      let some = requiredRoles.some((r: GroupName) => currentGroupes.includes(r));
      if (some ){
        return true;
      }else{
        this.appService.logout();
        return false;
      }
    }
    
    return true;
  }
  
}
