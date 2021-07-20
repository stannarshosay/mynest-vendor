import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-request-agent-removal',
  templateUrl: './request-agent-removal.component.html',
  styleUrls: ['./request-agent-removal.component.css']
})
export class RequestAgentRemovalComponent implements OnInit {
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";

  reason = new FormControl("");
  isRequesting:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<RequestAgentRemovalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private snackBar:MatSnackBar,
    private agentService:AgentService
  ) { }

  ngOnInit(): void {
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }  
  requestRemoval(){
    if(this.reason.valid){
      this.isRequesting = true;
      this.agentService.deleteAgent("removal",this.data,localStorage.getItem("vid"),this.reason.value).subscribe(res=>{
         this.isRequesting = false;
         if(res["success"]){
           this.dialogRef.close(true);
         }else{
           this.showSnackbar("Server error!",true,"close");
         }
      },error=>{  
       this.isRequesting = false;       
       this.showSnackbar("Connection error!",true,"close");
      });
    }else{
      this.showSnackbar("Please specify a reason",true,"close");
    }
      
  }
}
