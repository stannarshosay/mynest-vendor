import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { RequirementService } from 'src/app/services/requirement.service';

@Component({
  selector: 'app-report-requirement',
  templateUrl: './report-requirement.component.html',
  styleUrls: ['./report-requirement.component.css']
})
export class ReportRequirementComponent implements OnInit {
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";

  reason = new FormControl("",Validators.required);
  isReporting:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ReportRequirementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar:MatSnackBar,
    private requirementService:RequirementService
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
  reportRequirement(){
    if(this.reason.valid){
       this.isReporting = true;
       let paramData = {};
       paramData["requirementId"] = this.data.requirementId;
       paramData["reportingVendorId"] = localStorage.getItem("vid");
       paramData["reason"] = this.reason.value;
       this.requirementService.reportRequirement(paramData).subscribe(res=>{
          this.isReporting = false;
          if(res["success"]){
            this.dialogRef.close(true);
          }else{
            this.showSnackbar("Server error!",true,"close");
          }
       },error=>{  
        this.isReporting = false;       
        this.showSnackbar("Connection error!",true,"close");
       });
    }else{
      this.showSnackbar("Please specify a reason",true,"close");
    }
  }
}
