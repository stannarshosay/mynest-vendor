import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-refferal-code',
  templateUrl: './refferal-code.component.html',
  styleUrls: ['./refferal-code.component.css']
})
export class RefferalCodeComponent implements OnInit {

  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";

  code = new FormControl("",Validators.required);
  isProcessing:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<RefferalCodeComponent>,
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
  addAgent(){
    if(this.code.valid){
       this.isProcessing = true;
       this.agentService.checkRefferalCode(this.code.value).subscribe(res=>{
          this.isProcessing = false;
          if(res["success"]){
            this.showSnackbar("Agent Selected!",true,"close");
            this.dialogRef.close({
              isAgent:true,
              agent:res["data"]
            })
          }else{
            this.showSnackbar("No Agent With This Refferal Code!",true,"close");
          }
       },error=>{  
        this.isProcessing = false;   
        // this.showSnackbar("Connection error!",true,"close");
        this.showSnackbar("No Agent With This Refferal Code!",true,"close");
       });
    }else{
      this.showSnackbar("Please enter a refferal code",true,"close");
    }
  }
  closeDialog(){
    this.dialogRef.close({
      isAgent:false
    })
  }
}
