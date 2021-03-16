import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { RegisterLoginService } from 'src/app/services/register-login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";

  email = new FormControl("",Validators.compose([Validators.required,Validators.email]));
  isProcessing:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private snackBar:MatSnackBar,
    private loginService:RegisterLoginService
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
  forgot(){
    if(this.email.valid){
       this.isProcessing = true;
       this.loginService.forgotPasswordOfVendor(this.email.value,"ROLE_VENDOR").subscribe(res=>{
          this.isProcessing = false;
          if(res["success"]){
            this.email.setValue("");
          }
          this.showSnackbar(res["message"],true,"close");
       },error=>{  
        this.isProcessing = false;       
        this.showSnackbar("Connection error!",true,"close");
       });
    }else{
      this.showSnackbar("Please enter a valid email",true,"close");
    }
  }
}
