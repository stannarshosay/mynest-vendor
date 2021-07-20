import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { ChatroomService } from 'src/app/services/chatroom.service';
import { RegisterLoginService } from 'src/app/services/register-login.service';
import { VendorService } from 'src/app/services/vendor.service';
import moment from 'moment';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isGettingAnnouncements:boolean = false;
  isLoggedIn:boolean = false;
  logoValueSubscription:Subscription;
  getLoginSetStatusSubscription:Subscription;
  getRecievedMessagesSubscription:Subscription;
  getRecievedNotificationsSubscription:Subscription;
  isNavMessagesLoaded:boolean = false;
  isNavNotificationsLoaded:boolean = false;
  navMessages:any = "";
  navNotifications:any = "";
  messageCount:string = "";
  notificationCount:string = "";
  announcementOptions: OwlOptions = {
    autoplay:false,
    items:1,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: [ '<i class="ti-angle-left"></i>', '<i class="ti-angle-right"></i>' ],
    nav: true
  }
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";  
  vendorUsername:string = "Guest";
  vendorCompanyLogo:string = "";
  announcements:any[] = [];
  constructor(
    private router:Router,
    private chatService:ChatroomService,
    private registerLoginService:RegisterLoginService,
    private vendorService:VendorService
  ) { }

  ngOnInit(): void {
    this.vendorUsername = localStorage.getItem("vname");
    this.getLoginSetStatusSubscription = this.registerLoginService.getLoginSetStatus().subscribe(res =>{
      this.isLoggedIn = res;
      if(res){
        this.chatService.connectAndSubscribeToWebsocket();
      }else{
        this.chatService.disconnectFromWebsocket();
      }
    });
    this.logoValueSubscription = this.registerLoginService.getLogoChangedValue().subscribe(res=>{
      this.vendorCompanyLogo = res;
    });
    this.getRecievedMessagesSubscription = this.chatService.getRecievedMessages().subscribe(res =>{
      this.isNavMessagesLoaded = false;
      this.navMessages = "";
      if(this.isLoggedIn){
        this.setMessageUnreadCount();
        this.setMessagesNav();
      }else{
        this.isNavMessagesLoaded = true;
        this.navMessages = "";
      }
    });
    this.getRecievedNotificationsSubscription = this.chatService.getRecievedNotification().subscribe(res =>{
      this.isNavNotificationsLoaded = false;
      this.navNotifications = "";
      if(this.isLoggedIn){
        this.setNotificationUnreadCount();
        this.setNotificationsNav();
      }else{
        this.isNavNotificationsLoaded = true;
        this.navNotifications = "";
      }
    });
    if(this.isLoggedIn){
      this.setMessageUnreadCount();
      this.setMessagesNav();
      this.setNotificationUnreadCount();
      this.setNotificationsNav();
    }else{
      this.messageCount = "";
      this.isNavMessagesLoaded = true;
      this.notificationCount = "";
      this.isNavNotificationsLoaded = true;
    }    
    this.getAnnouncements();
  }
  getAnnouncements(){
    this.vendorService.getAnnouncements().subscribe(res=>{
      this.isGettingAnnouncements = true;
      if(res["success"]){
        this.announcements = res["data"];
      }else{
        this.announcements.push({
          message:"No announcements yet..."
        });
      }
    },error=>{
      console.log(error);
    })
  }
  setMessageUnreadCount(){
      this.chatService.getMessagesUnreadCount(localStorage.getItem("vid")).subscribe(res=>{
        if(res["success"]){
          this.messageCount = res["data"] == 0?"":res["data"]>50?"50+":res["data"];
        }
      }); 
  }
 setMessagesNav(){
    this.chatService.getChatContactsByVendorId(localStorage.getItem("vid")).subscribe(res=>{
      this.isNavMessagesLoaded = true;
      if(res["success"]){
        this.navMessages = res["data"].slice(0,5);
      }else{
        this.messageCount = "";
        this.navMessages = "";
      }
    });   
  }
  setNotificationUnreadCount(){
    this.chatService.getNotificationsUnreadCount(localStorage.getItem("vid")).subscribe(res=>{
      if(res["success"]){
        this.notificationCount = res["data"] == 0?"":res["data"]>50?"50+":res["data"];
      }
    }); 
  }
  setNotificationsNav(){
    this.chatService.getAllNotifications(localStorage.getItem("vid"),0,5).subscribe(res=>{
      this.isNavNotificationsLoaded = true;
      if(res["success"]){
        this.navNotifications = res["data"]["content"];
      }else{
        this.notificationCount = "";
        this.navNotifications = "";
      }
    });   
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
  getImagePath(imagePath:string){
    if((imagePath)&&imagePath != ""){
      return encodeURIComponent(imagePath);
    }
    return encodeURIComponent("default.jpg");
  }
  checkLength(message:string){    
    if(message.length>15){
      return message.substring(0,15) +" ...";
    }
    return message;
  }
  goToChatroom(provider:any){  
    this.chatService.setContactData(provider);
    if(this.router.url == "/dashboard"){
      this.chatService.whenSamePageMessages.next(true);
    }
    this.router.navigate(["/dashboard"]);
  }
  goToRespectivePage(notificationType:string,notificationId:any){
    this.updateReadStatus(notificationId);
    switch(notificationType){
      case "AD_ACCEPTED":{
        this.router.navigateByUrl("/my-advertisements");
        break;
      }
      case "AD_REJECTED ":{
        this.router.navigateByUrl("/my-advertisements");
        break;
      }
      case "PROFILE_VERIFIED":{
        this.router.navigateByUrl("/dashboard");
        break;
      }
      case "REQ_REPORT_ACCEPTED":{
        this.router.navigateByUrl("/requirements");
        break;
      }
      case "REQ_REPORT_REJECTED":{
        this.router.navigateByUrl("/requirements");
        break;
      }      
      case "NEW_REQUIREMENT":{
        this.router.navigateByUrl("/requirements");
        break;
      }
      case "AD_RUNNING":{
        this.router.navigateByUrl("/my-advertisements");
        break;
      }
      case "AUTO_PLAN_DOWN":{
        this.router.navigateByUrl("/packages");
        break;
      }
      case "AGENT_REMOVAL_REJECTED":{
        this.router.navigateByUrl("/profile-settings");
        break;
      }
      case "AGENT_REMOVAL_ACCEPTED":{
        this.router.navigateByUrl("/profile-settings");
        break;
      }
    }
}
getBeautifiedDate(dateString:string){
  let date = moment(dateString, "DD/MM/YYYY HH:mm:ss");
  if(date.isSame(moment(),'day')){
    return "Today " + date.format('h:mm a');
  }
  if(date.isSame(moment().subtract(1,"days"),'day')){      
    return "Yesterday " + date.format('h:mm a');
  }
  return date.format('Do MMM YYYY h:mm a');
}
updateReadStatus(notificationId:any){    
  let paramData = {};
  paramData["notificationIds"] = [notificationId];
  if(paramData["notificationIds"].length){
    this.chatService.updateNotificationReadStatus(paramData).subscribe(res=>{
        this.chatService.hasRecievedNotification.next("no"); 
    },error=>{
      console.log(error);
    });
  }
}
  ngOnDestroy():void{
     this.logoValueSubscription.unsubscribe();
     this.getLoginSetStatusSubscription.unsubscribe();
     this.getRecievedMessagesSubscription.unsubscribe();
     this.getRecievedNotificationsSubscription.unsubscribe();
  }
}
