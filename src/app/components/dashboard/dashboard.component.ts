import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatroomService } from 'src/app/services/chatroom.service';
import { RegisterLoginService } from 'src/app/services/register-login.service';
import moment from 'moment';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('chatbox') private chatbox: ElementRef;
  vendorId:any; 
  getLoginSetStatus:Subscription;
  getRecievedMessagesSubscription:Subscription;
  getSamePageMessagesSubscription:Subscription;
  isGettingContacts:boolean = false;
  showNoContacts:boolean = false;
  isGettingMessages:boolean = false;
  showNoMessages:boolean = false;
  messages:any[] = [];
  contactData:any;
  messageControl:FormControl;
  contacts:any[] = [];
  dateForExpiryAsString:string = "0";
  vendorDetails:any = "";
  messageCount:string = "";
  isGettingVendorDetails:boolean = true;
  isGettingMessageCount:boolean = true;
  quoteProgress:number = 0;
  quoteFilename:string = "";
  quoteFile:File=null;
  isUploading:boolean = false;

   constructor(
     private loginService:RegisterLoginService,
     private router:Router,
     private chatService:ChatroomService,
     private snackBar:MatSnackBar
   ) { }
 
   ngOnInit(): void {   
     this.messageControl = new FormControl('',Validators.required);
     this.vendorId = localStorage.getItem("vid");
     this.getVendorProfileDetails();
     this.getLoginSetStatus = this.loginService.getLoginSetStatus().subscribe(res =>{      
       if(!res){
         this.router.navigate(["home"]);
       }
     });
     this.getRecievedMessagesSubscription = this.chatService.getRecievedMessages().subscribe(res=>{
        if(res!="no"){
          this.onRecieveMessage(res);
        }
        this.setMessageUnreadCount();
     });
     this.getSamePageMessagesSubscription = this.chatService.getSamePageMessagesStatus().subscribe(res=>{
      if(res){
        this.isGettingContacts = false;
        this.showNoContacts = false;
        this.isGettingMessages = false;
        this.showNoMessages = false;
        this.messages = [];
        this.contactData = null;
        this.contacts = [];
        this.getAllContacts(true);  
      }
    });
     this.getAllContacts(true);   
   }
   getVendorProfileDetails(){
    this.isGettingVendorDetails = true;
    this.loginService.getVendorBasicDetails(localStorage.getItem("vid")).subscribe(res=>{
      this.isGettingVendorDetails = false;
      if(res["success"]){
        this.vendorDetails = res["data"];
        this.setMessageUnreadCount();
        this.setDaysLeft();
      }
    },error=>{
      console.log(error);
    });
    }
    setMessageUnreadCount(){
      this.isGettingMessageCount = true;
      this.chatService.getMessagesUnreadCount(localStorage.getItem("vid")).subscribe(res=>{
        this.isGettingMessageCount = false;
        if(res["success"]){
          this.messageCount = res["data"]>50?"50+":res["data"];
        }else{
          this.messageCount = "";
        }
      }); 
    }
    setDaysLeft() {
      let startDate = new Date();
      let endDate = new Date(Number(this.vendorDetails.packageExpiryDate.split("/")[2]),Number(this.vendorDetails.packageExpiryDate.split("/")[1])-1,Number(this.vendorDetails.packageExpiryDate.split("/")[0]));
      const oneDay = 1000 * 60 * 60 * 24;  
      let start = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      let end = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());  
      let diff = (start - end) / oneDay;
      if(diff<0){
        this.dateForExpiryAsString = "0";
      }else{
        this.dateForExpiryAsString = diff.toString();
      }
    }
   ngOnDestroy():void{
     this.getLoginSetStatus.unsubscribe();
     this.getRecievedMessagesSubscription.unsubscribe();
     this.getSamePageMessagesSubscription.unsubscribe();
   }
   showSnackbar(content:string,hasDuration:boolean,action:string){
     const config = new MatSnackBarConfig();
     if(hasDuration){
       config.duration = 3000;
     }
     config.panelClass = ['snackbar-styler'];
     return this.snackBar.open(content, action, config);
   }
   getAllContacts(shouldLoadMessages:boolean){
     this.isGettingMessages = true;
     this.isGettingContacts = true;
     this.chatService.getChatContactsByVendorId(this.vendorId).subscribe(res=>{
       this.isGettingContacts = false;
       if(res["success"]){
         this.contacts = res["data"];
       }else{
         this.showNoContacts = true;
       }
       if(shouldLoadMessages){
        this.checkRecievedContactData();
       }
     },error=>{
       this.showNoContacts = true;
       this.isGettingContacts = false;
       this.showSnackbar("Connection error!",true,"close");
     });
   }
   checkRecievedContactData(){
    if(this.chatService.hasContactData()){
      this.contactData =  this.chatService.getContactData();
      this.chatService.clearContactData();
      let index = this.contacts.findIndex(obj=>obj.customerId == this.contactData.customerId);
      if(index>-1){
        this.contactData = this.contacts[index];
        this.contacts.splice(index,1);
        this.contacts.unshift(this.contactData);
      }else{
        this.contacts.unshift(this.contactData);
      }      
      this.getMessages(this.contactData.customerId);
    }else if(this.contacts.length){
      this.contactData = this.contacts[0];
      this.getMessages(this.contactData.customerId);
    }else{
      this.isGettingMessages = false;
      this.showNoMessages = true;
    }
   }
   getMessages(customerId:any){
     this.messages = [];
     this.showNoMessages = false;
     this.isGettingMessages = true;
     this.chatService.getMessagesByCustomerAndVendorId(this.vendorId,customerId).subscribe(res=>{
        this.isGettingMessages = false;
        if(res["success"]){
           this.messages = res["data"].reverse();
           this.chatService.hasRecievedMessage.next("no");
           this.scrollToBottom();
        }else{
          this.showNoMessages = true;
        }
     },error=>{
       this.isGettingMessages = false;
       this.showNoMessages = true;
       this.showSnackbar("Connection error!",true,"close");      
     });
   }
   getMessagesToUpdateUnreadCount(customerId:any){
    this.chatService.getMessagesByCustomerAndVendorId(this.vendorId,customerId).subscribe(res=>{
      if(res["success"]){
        this.chatService.hasRecievedMessage.next("no");
      }
    });
  }
   loadChatroom(contact:any){
     this.contactData = contact;
     this.getMessages(contact.customerId);
   }
   sendMessage(){
     if(this.messageControl.valid){
       let message = {
         customerId: Number(this.contactData.customerId),
         vendorId: Number(this.vendorId),
         senderId: this.vendorId,
         recipientId: this.contactData.customerId,
         content: this.messageControl.value,
         messageType:"TEXT"
       }; 
       if(this.chatService.sendMessage(message)){
         this.showNoMessages = false;
         let date = this.getFormattedDate();
         let index = this.contacts.findIndex(obj=>obj.customerId == this.contactData.customerId);
         this.contacts.splice(index,1);
         this.contactData["lastMessageTime"] = date;
         this.contactData["lastMessage"] = message.content;
         this.contacts.unshift(this.contactData);
         message["sentTime"] = date;
         this.messages.push(message);  
         this.messageControl.setValue("");   
         setTimeout(()=>{
          this.chatService.hasRecievedMessage.next("no");
         },5000); 
       }  
     }else{
       this.showSnackbar("No message to send!",true,"okay");
     }
   }
   sendQuoteMessage(){
    let message = {
      customerId: Number(this.contactData.customerId),
      vendorId: Number(this.vendorId),
      senderId: this.vendorId,
      recipientId: this.contactData.customerId,
      content: this.quoteFilename,
      messageType:"FILE"
    }; 
    if(this.chatService.sendMessage(message)){
      this.showNoMessages = false;
      let date = this.getFormattedDate();
      let index = this.contacts.findIndex(obj=>obj.customerId == this.contactData.customerId);
      this.contacts.splice(index,1);
      this.contactData["lastMessageTime"] = date;
      this.contactData["lastMessage"] = message.content;
      this.contacts.unshift(this.contactData);
      message["sentTime"] = date;
      this.messages.push(message);  
      setTimeout(()=>{
       this.chatService.hasRecievedMessage.next("no");
      },5000); 
    }
   }
   onRecieveMessage(message:any){    
     if(message.senderId == this.contactData.customerId){
       this.messages.push(message);
       this.getMessagesToUpdateUnreadCount(this.contactData.customerId);
     }else{
       this.chatService.hasRecievedMessage.next("no");
     } 
     let index = this.contacts.findIndex(obj=>obj.customerId == message.senderId);
     if(index>-1){
      let contact = this.contacts[index];
      contact["lastMessageTime"] = message.sentTime;
      contact["lastMessage"] = message.content;
      this.contacts.splice(index,1);
      this.contacts.unshift(contact);  
     }else{
       this.getAllContacts(false);
       this.isGettingMessages = false;
     } 
   }
   onQuoteSelect(event:any){
    var _size = event.target.files[0].size;
    var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),i=0;
        while(_size>900)
        {
          _size/=1024;
          i++;
        }
    if((((Math.round(_size*100)/100)>3)&&(i==2))||(i==3)){
      this.showSnackbar("File size is larger than 3 MB",true,"okay");
    }else{
      this.quoteFile = event.target.files[0];
      if(this.quoteFile){  
        this.uploadQuote(event);
      }  
    }      
  }
  uploadQuote(fileEvent:any){
    this.isUploading =true;
    this.showSnackbar("Please be patient! sending quote...",true,"okay");
    const uploadData = new FormData();
    uploadData.append('quote', this.quoteFile);
    this.chatService.uploadQuote(uploadData).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          this.quoteFilename = "";
          this.quoteProgress = 1;
          break;
        case HttpEventType.ResponseHeader:
          break;
        case HttpEventType.UploadProgress:
          this.quoteProgress = Math.round(event.loaded / event.total * 100);
          break;
        case HttpEventType.Response:
          this.isUploading = false;
          if(event.body["success"]){
            this.showSnackbar("Send quote successfully",true,"close");            
            this.quoteFilename = event.body["data"]; 
            this.sendQuoteMessage();   
          }else{
            this.showSnackbar("Server error",true,"close");
          }
          setTimeout(() => {
            this.quoteProgress = 0;
          }, 1500);
          break;
        default:
          this.quoteProgress = 0;
          return `Unhandled event: ${event.type}`;
      }
    },error=>{
        this.quoteProgress = 0;
        this.isUploading = false;
        this.showSnackbar("Connection Error!",true,"close");
    });
  }
   getImagePath(path:string){
     if((path)&&(path!="")){
       return encodeURIComponent(path);
     }
     return encodeURIComponent("default.jpg");
   }
   downloadChatQuote(filePath:string){
    if((filePath)&&(filePath!="")){
      window.open(
        'https://mynestonline.com/collection/images/chat-quotes/'+encodeURIComponent(filePath),
        '_blank'
      );
    }else{
      this.showSnackbar("No qoute found!",true,"close");
    }
  }
  checkLength(message:string){    
      if(message.length>15){
        return message.substring(0,15) +" ...";
      }
      return message;
   }
   getFormattedDate() {
      return moment().format("DD/MM/YYYY HH:mm:ss");
   }
   ngAfterViewChecked() {        
     this.scrollToBottom();        
   } 
   scrollToBottom(): void {
     try {
         this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight;
     } catch(err) { 
       console.log("error on scroll to bottom : "+err);
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
}
