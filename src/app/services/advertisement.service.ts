import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdvertisementService {

  constructor(
    private http:HttpClient
  ) { }

  getAllSlots(params:any){
    return this.http.post("https://mynestonline.com/collection/api/available-slots",params);
  }
  bookSlotIds(params:any){
    return this.http.post("https://mynestonline.com/collection/api/book-ad-slots",params);
  }
  getBookedSlots(vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/booked-slots?vendorId="+vendorId,null);
  }
  uploadAdPic(fileFormData:any,vendorAdId:string){
    return this.http.post("https://mynestonline.com/collection/api/request-ad-approval?vendorAdId="+vendorAdId,fileFormData,{
      reportProgress: true,
      observe: 'events'
    });
  }
}
