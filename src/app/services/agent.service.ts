import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  constructor(
    private http:HttpClient
  ) { }

  deleteAgent(requestType:string,agentId:string,vendorId:string,reason:string){
    return this.http.post("https://mynestonline.com/collection/api/request?agentId="+agentId+"&vendorId="+vendorId+"&requestType="+requestType+"&reason="+reason,null);
  } 
  getAgentDetailsByVendorId(vendorId:string){
    return this.http.get("https://mynestonline.com/collection/api/vendor/agent?vendorId="+vendorId);
  }
  checkRefferalCode(code:string){
    return this.http.get("https://mynestonline.com/collection/api/agents/code?rewardCode="+code);
  }
  addAgent(agentId:string,vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/request?agentId="+agentId+"&vendorId="+vendorId+"&requestType=addition",null);
  }
}
