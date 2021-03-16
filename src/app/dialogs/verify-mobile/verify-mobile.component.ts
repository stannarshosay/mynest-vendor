import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription, timer } from 'rxjs';
import { RegisterLoginService } from 'src/app/services/register-login.service';

@Component({
  selector: 'app-verify-mobile',
  templateUrl: './verify-mobile.component.html',
  styleUrls: ['./verify-mobile.component.css']
})
export class VerifyMobileComponent implements OnInit {
  isProcessing:boolean = false;
  info:string = "Sending otp via mobile...";
  otp = new FormControl("",Validators.required);
  isCounting:boolean = false;
  countDown: Subscription;
  counter = 50;
  tick = 1000;
  constructor(
    public dialogRef: MatDialogRef<VerifyMobileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar:MatSnackBar,
    public registerLoginService:RegisterLoginService
  ) { }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
    this.sendOTP();
  }
  ngOnDestroy(){
    this.countDown=null;
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  sendOTP(){
    this.info = "Sending otp via mobile...";
    this.isProcessing = true;
    this.showSnackbar("Sending OTP via mobile...",true,"okay");
    this.registerLoginService.sendMobileOtp(this.data.mobile).subscribe(res=>{
      this.isProcessing = false;
      if(res["success"]){
          this.isCounting = true;
          this.countDown = timer(0, this.tick).subscribe(() => {
            if(this.counter>0){
              --this.counter;
            }else{
              this.isCounting = false;
              this.countDown = null;
              this.counter = 50;
            }
          });
          this.showSnackbar("OTP sent successfully!",true,"okay");
          this.info = "Please enter otp sent to "+this.data.mobile;
        }else{
          this.showSnackbar(res["message"],true,"close");
          this.dialogRef.close(false);
        }
    },error=>{
      this.showSnackbar("Error sending SMS, check mobile number",true,"close");
      this.isProcessing = false;
      this.dialogRef.close(false);
      console.log(error);
    });
  }
  verifyOTP(){    
    if(this.otp.valid){
      this.info = "Verifying otp...";
      this.isProcessing = true;
      this.showSnackbar("Verifying mobile number...",false,"");
      this.registerLoginService.verifyOtp(this.otp.value).subscribe(res=>{
        this.isProcessing = false;
        if(res["success"]){
          this.showSnackbar("Mobile number verified successfully!",true,"close");
          this.dialogRef.close(true);
        }else{
          this.info = "Please enter otp sent to "+this.data.mobile;
          this.showSnackbar("Wrong otp!",true,"close");
        }
      },error=>{
        this.isProcessing = false;
        this.info = "Otp expired, please resend "+this.data.mobile;
        this.showSnackbar("Oops! otp expired, please resend",true,"okay");
      });
    }else{
      this.showSnackbar("Please enter otp recieved",true,"close");
    }
  }
}
