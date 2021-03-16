import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RegisterLoginService } from './services/register-login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mynest-vendor';
  isFullPage:boolean = false;
  constructor(
    private router:Router
  ) {} 
   ngAfterContentChecked():void{
     let page = this.router.url;
     switch(page){
       case "/signup":{
         this.isFullPage = true;
         break;
       }
       case "/login":{
        this.isFullPage = true;
        break;
      }
      case "/select-package":{
        this.isFullPage = true;
        break;
      }
      case "/profile":{
        this.isFullPage = true;
        break;
      }
       default:{
        this.isFullPage = false;
        break;
       }
     }       
   }
}
