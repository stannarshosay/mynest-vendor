import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RegisterLoginService } from '../services/register-login.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {
  constructor(
    private registerLoginService:RegisterLoginService,
    private router:Router
  ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let hasLoggedIn:boolean = false; 
      let profileStatus:string = "COMPLETED";
      this.registerLoginService.getLoginSetStatus().subscribe(status => hasLoggedIn = status);
      this.registerLoginService.getProfileStatus().subscribe(status => profileStatus = status);
      if(hasLoggedIn){
        switch(profileStatus){
          case "REGISTERED":{  
            this.router.navigate(['/select-package']);          
            return false;
          }
          case "SUBSCRIBED":{
            return true;
          }
          case "COMPLETED":{
            this.router.navigate(['/dashboard']);
            return false;
          }
        }
      }else{
        this.router.navigate(['login']);
        return false;
      }
  }
  
}
