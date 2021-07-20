import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { RegisterLoginService } from 'src/app/services/register-login.service';

@Component({
  selector: 'app-login-otp',
  templateUrl: './login-otp.component.html',
  styleUrls: ['./login-otp.component.css']
})
export class LoginOtpComponent implements OnInit {
  title:string = "Enter mobile number";
  infoText:string = "An otp will be send to your registered mobile number";
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  isProcessing:boolean = false;
  otp = new FormControl("",Validators.required);
  isSubmitted = false;
  isSendOtp:boolean = false;
  mobile:string = null;
  mobileForm = this.fb.group({    
    mobile:['',[Validators.required,Validators.pattern("^[0-9]{10}$")]]
  });
  constructor(
    private fb:FormBuilder,
    private snackBar: MatSnackBar,
    private loginService:RegisterLoginService,
    public dialogRef: MatDialogRef<LoginOtpComponent>

  ) { }

  ngOnInit() {
    this.dialogRef.disableClose = true;
  }
  dismiss(isVerified:boolean,data:any){
    this.dialogRef.close({
      "isVerified":isVerified,
      "data":data
    });
  } 
  sendOtp(){
    this.isSendOtp = false;
    this.isSubmitted = true;
      if(this.mobileForm.valid){
        this.isProcessing = true;
        this.loginService.sendOtpForLogin(this.mobileForm.get("mobile").value,"ROLE_VENDOR").subscribe(res=>{
          this.isProcessing = false;
          this.isSendOtp = false;
          if(res["success"]){
            this.infoText = "Enter the otp send to your registered mobile number for verification";
            this.title = "Verify login";
            this.isSendOtp = true;
            this.isSubmitted = false;
            this.mobile = this.mobileForm.get("mobile").value;
          }else{
            this.showSnackbar(res["message"],true,"close");
          }
        },error=>{
          this.isSendOtp = false;
          this.isProcessing = false;
        });
      }else{
        this.showSnackbar("Please check all required fields",true,"okay");
      }
  }
  verifyLogin(){
     if(this.otp.valid){
       let paramData={};
       paramData["mobile"] = this.mobile;
       paramData["otp"] = this.otp.value;
       paramData["role"] = "ROLE_VENDOR";
       this.isProcessing = true;
        this.loginService.verifyOtpForLogin(paramData).subscribe(res=>{
          this.isProcessing = false;
          if(res["success"]){
            this.mobile = null;
            this.dismiss(true,res["data"]);
          }else{
            this.showSnackbar(res["message"],true,"close");
          }
        },error=>{         
          this.isProcessing = false;
        });
     }else{
      this.showSnackbar("Enter a 4 digit otp!",true,"okay");
     }
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }

}
