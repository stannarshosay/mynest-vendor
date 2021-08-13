import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { RequirementService } from 'src/app/services/requirement.service';

@Component({
  selector: 'app-send-qoute',
  templateUrl: './send-qoute.component.html',
  styleUrls: ['./send-qoute.component.css']
})
export class SendQouteComponent implements OnInit {
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  quoteFilename:string = "";
  isSending:boolean = false;

  quoteFile:File=null;
  constructor(
    public dialogRef: MatDialogRef<SendQouteComponent>,
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
  sendQuote(){
    if(this.quoteFile){
       this.isSending = true;
       this.showSnackbar("Please be patient! uploading quote...",false,"");
       let paramData = {};       
       paramData["requirementId"] = this.data.requirementId;
       paramData["vendorId"] = localStorage.getItem("vid");
       const uploadData = new FormData();
       uploadData.append('quote', this.quoteFile);
       uploadData.append('quoteDTO',new Blob([JSON.stringify(paramData)], { type: "application/json"}));
       this.requirementService.sendQoute(uploadData).subscribe(res=>{
          this.isSending = false;
          if(res["success"]){
            this.quoteFile = null;
            this.dialogRef.close(true);
          }else{
            this.showSnackbar("Server error!",true,"close");
          }
       },error=>{  
        this.isSending = false;       
        this.showSnackbar("Connection error!",true,"close");
       });
    }else{
      this.showSnackbar("Please select a quote file",true,"close");
    }
  }

  onQuoteSelect(event:any,fileInput:any){
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
      this.quoteFilename = this.quoteFile.name; 
    }     
  }
}
