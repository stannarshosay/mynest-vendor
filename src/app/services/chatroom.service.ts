import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {
  contactData:any = "";
  webSocketEndPoint: string = 'https://mynestonline.com/collection/ws';
  stompClient:any = null;
  public hasRecievedMessage = new Subject<any>();
  public hasRecievedNotification = new Subject<any>();

  constructor(
    private http:HttpClient
  ) { }
  getContactData(){
    return this.contactData;
  }
  setContactData(contactData:any){
    this.contactData = contactData;
  }
  clearContactData(){
    this.contactData = "";
  }
  hasContactData(){
    return this.contactData == ""?false:true;
  }
  getChatContactsByVendorId(vendorId:any):Observable<any>{
    return this.http.get("https://mynestonline.com/collection/api/all-chats/vendor?vendorId="+vendorId);     
  } 
  getMessagesByCustomerAndVendorId(vendorId:any,customerId:any):Observable<any>{
    return this.http.post("https://mynestonline.com/collection/api/messages?customerId="+customerId+"&vendorId="+vendorId,null);     
  }  
  getRecievedMessages():Observable<any>{
    return this.hasRecievedMessage.asObservable();
  }
  getMessagesUnreadCount(userId:string):Observable<any>{
    return this.http.get("https://mynestonline.com/collection/api/chat/count?userId="+userId); 
  }
  getNotificationsUnreadCount(userId:string):Observable<any>{
    return this.http.get("https://mynestonline.com/collection/api/notifications/count?userId="+userId); 
  }
  getAllNotifications(userId:string,pageNo:number,pageSize:number):Observable<any>{
    return this.http.get("https://mynestonline.com/collection/api/get-notifications?userId="+userId+"&pageNo="+pageNo+"&pageSize="+pageSize); 
  }
  updateNotificationReadStatus(notificationIds:any):Observable<any>{
    return this.http.put("https://mynestonline.com/collection/api/notifications/update",notificationIds); 
  }
  getRecievedNotification():Observable<any>{
    return this.hasRecievedNotification.asObservable();
  }
  uploadQuote(fileFormData:any){
    return this.http.post("https://mynestonline.com/collection/api/chat/upload-quote",fileFormData,{
      reportProgress: true,
      observe: 'events'
    });
  }

  //websocket
  connectAndSubscribeToWebsocket(){
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    this.stompClient.debug = () => {};
    let that = this;
    this.stompClient.connect({},function(frame:any) {
      console.log("Connected!");
      that.stompClient.subscribe("/user/" + localStorage.getItem("vid") + "/queue/messages",function(message:any)
       {
        that.hasRecievedMessage.next(JSON.parse(message["body"]));
        that.playMessageAudio();
       }       
     );   
     that.stompClient.subscribe("/user/" + localStorage.getItem("vid") + "/queue/notification",function(notification:any)
       {
        that.hasRecievedNotification.next(JSON.parse(notification["body"]));
        that.playNotificationAudio();
       }       
     ); 
    }, this.errorCallBack);
  }
  playMessageAudio(){
    let audio = new Audio();
    audio.src = "../../assets/sounds/message.wav";
    audio.load();
    audio.play();
  }
  playNotificationAudio(){
    let audio = new Audio();
    audio.src = "../../assets/sounds/notify.wav";
    audio.load();
    audio.play();
  }
  errorCallBack(error:any) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
        this.connectAndSubscribeToWebsocket();
    }, 5000);
  }
  sendMessage(message:any):boolean{  
    if (this.stompClient !== null) {
      this.stompClient.send("/app/chat", {}, JSON.stringify(message));
      return true;
    }
    return false;
  }
  disconnectFromWebsocket(){
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected!");
  }
}
