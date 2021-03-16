import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RegisterLoginService } from '../services/register-login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private registerLoginService:RegisterLoginService,
    private router:Router
  ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let hasLoggedIn:boolean = false; 
      this.registerLoginService.getLoginSetStatus().subscribe(status => hasLoggedIn = status);
      if(hasLoggedIn){
        this.router.navigate(['dashboard']);
        return false;
      }else{
        return true;
      }
  }
  
}
