import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(
    private http:HttpClient
  ) { }
  getVendorDashboardDetails(vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/vendor-basic?vendorId="+vendorId,null);
  }
  getAnnouncements(){
    return this.http.get("https://mynestonline.com/collection/api/announcements");
  }
}
