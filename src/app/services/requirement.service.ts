import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequirementService {

  constructor(
    private http:HttpClient
  ) { }
  getRequirements(vendorId:any,pageNo:any,pageSize:any):Observable<any>{
    return this.http.post("https://mynestonline.com/collection/api/vendor-requirements?vendorId="+vendorId+"&pageNo="+pageNo+"&pageSize="+pageSize,null);
  }
  sendQoute(uploadData:any):Observable<any>{
    return this.http.post("https://mynestonline.com/collection/api/upload-quote",uploadData);
  }
  reportRequirement(paramData:any){
    return this.http.post("https://mynestonline.com/collection/api/report-requirement",paramData);
  }
}
