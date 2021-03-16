import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatroomService } from 'src/app/services/chatroom.service';
import { RegisterLoginService } from 'src/app/services/register-login.service';
declare var jQuery:any;
@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {

  vendorDetails:any;
  logoChangedStatusSubscription:Subscription;
  constructor(
    private registerLoginService:RegisterLoginService,
    private chatService:ChatroomService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.collapseMenuSidebar();
    if(localStorage.getItem("vid")){
      this.getVendorProfileDetails();
    }
    this.logoChangedStatusSubscription = this.registerLoginService.getLogoChangedStatus().subscribe(res=>{
      if(res){
        this.getVendorProfileDetails();
      }
    });
  }
  
  getVendorProfileDetails(){
    this.registerLoginService.getVendorProfileDetails(localStorage.getItem("vid")).subscribe(res=>{
      if(res["success"]){
        this.vendorDetails = res["data"];
        this.registerLoginService.logoChangedValue.next(res["data"]["logo"]);
      }
   },error=>{
     console.log(error);
   });
  }
  getImagePath(imagePath:string){
      if((imagePath)&&imagePath != ""){
        return encodeURIComponent(imagePath);
      }
      return encodeURIComponent("default.jpg");
  }  
  logout(){
    localStorage.setItem("vid","");
    localStorage.setItem("vname","");
    localStorage.setItem("vstatus","");
    this.registerLoginService.hasLoggedIn.next(false);
    this.chatService.hasRecievedMessage.next("no");
    this.chatService.hasRecievedNotification.next("no");
    this.router.navigate(['login']);
  }
 ngOnDestroy():void{
   this.logoChangedStatusSubscription.unsubscribe();
 }
 //jquery
 collapseMenuSidebar() {
    jQuery('.sl-navdashboard ul li.menu-item-has-children').on('click', function() {
        jQuery(this).toggleClass('sl-openmenu');
        jQuery(this).find('.sub-menu').slideToggle(300);
    });
  }
}
