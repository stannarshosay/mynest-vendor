import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ForgotPasswordComponent } from 'src/app/dialogs/forgot-password/forgot-password.component';
import { ChatroomService } from 'src/app/services/chatroom.service';
import { RegisterLoginService } from 'src/app/services/register-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  showSpinner:boolean = false;
  loginForm = this.fb.group({
    username:['',Validators.required],
    password:['',Validators.required]
  });

  constructor(
    private registerLoginService:RegisterLoginService,
    private chatService:ChatroomService,
    private dialog:MatDialog,
    private fb:FormBuilder,
    private snackBar:MatSnackBar,
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.showSpinner = true;
    if(this.loginForm.valid){
      this.registerLoginService.login(this.loginForm.get("username").value,this.loginForm.get("password").value).subscribe(res =>{
        this.showSpinner = false;
        if(res["success"]){
          localStorage.setItem("vid",res["data"]["id"]);
          localStorage.setItem("vname",res["data"]["username"]);
          this.registerLoginService.hasLoggedIn.next(true);
          this.chatService.hasRecievedMessage.next("no");
          this.chatService.hasRecievedNotification.next("no");
          this.setVendorStatusAndRedirect(res["message"]);
        }else{
          this.showSnackbar("Oops! "+res["message"]);
        }
      },
      error=>{
        this.showSpinner = false;
        this.showSnackbar("Oops! "+error["error"]["message"]);
      });
    }else{
      this.showSpinner = false;
      this.showSnackbar("Oops! no credentials entered");
    }
  }

  showSnackbar(content:string){
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    config.panelClass = ['snackbar-styler'];
    this.snackBar.open(content, "close", config);
  }
  setVendorStatusAndRedirect(message:string){
    this.registerLoginService.getVendorBasicDetails(localStorage.getItem('vid')).subscribe(res=>{
      if(res["success"]){
        localStorage.setItem("vstatus",res["data"]["profileCompletionStatus"]);
        this.registerLoginService.profileStatus.next(res["data"]["profileCompletionStatus"]);
        this.showSnackbar(message);
        this.router.navigate(["/dashboard"]);
      }else{
        this.showSnackbar("Server error!");
      }
    },error=>{
      this.showSnackbar("Connection error!");
    });    
  }
  forgotPassword(){
    const dialogRef = this.dialog.open(ForgotPasswordComponent);

    dialogRef.afterClosed().subscribe(result => {
      // console.log("forgot password closed");
    });
  }
}
