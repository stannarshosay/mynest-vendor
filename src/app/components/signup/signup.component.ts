import { ChangeDetectorRef, Component, ElementRef, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, MinLengthValidator, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { VerifyEmailComponent } from 'src/app/dialogs/verify-email/verify-email.component';
import { VerifyMobileComponent } from 'src/app/dialogs/verify-mobile/verify-mobile.component';
import { ChatroomService } from 'src/app/services/chatroom.service';
import { RegisterLoginService } from 'src/app/services/register-login.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  @ViewChild('terms') terms:ElementRef;
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  showSpinner:boolean = false;
  isSubmitted:boolean = false;
  isEmailVerified:boolean = false;
  emailTooltip:string = "needs verification";
  isMobileVerified:boolean = false;
  mobileTooltip:string = "needs verification";
  signupForm = this.fb.group({
    username:['',Validators.required],
    email:['',[Validators.required,Validators.email]],
    mobile:['',[Validators.required,Validators.pattern("^[0-9]{10}$")]],
    password:['',Validators.required],
    rePassword:['',Validators.required]
  });

  constructor(
    private registerLoginService:RegisterLoginService,
    private chatService:ChatroomService,
    private fb:FormBuilder,
    private snackBar:MatSnackBar,
    private router:Router,
    public dialog: MatDialog
  ) {

   }

  onSubmit(termsStatus:any){
    this.isSubmitted = true;
      if(this.signupForm.valid){
        if(this.signupForm.get("password").value==this.signupForm.get("rePassword").value){
          if(termsStatus){
            if(this.checkVerification()){
              let requestData = this.signupForm.value;
              delete requestData["rePassword"];
              this.register(requestData);
            }
          }else{
            this.showSnackbar("Please agree to terms and conditions",true,"okay");
          }        
        }else{
          this.showSnackbar("Passwords don't match",true,"okay");
        }      
      }else{
        this.showSnackbar("Please check all required fields",true,"okay");
      }
  }
  checkVerification():boolean{
      if(!this.isEmailVerified){
        const dialogRef = this.dialog.open(VerifyEmailComponent,{
          data:{
            email:this.signupForm.get("email").value
          },
          disableClose:true
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result){        
            this.isEmailVerified = true;
            this.emailTooltip = "verified, can't change";
            this.onSubmit(this.terms.nativeElement.checked);
          }else{
            this.signupForm.get("email").setValue("");
          }
        });
        return false;
      }
      if(!this.isMobileVerified){
        const dialogRef = this.dialog.open(VerifyMobileComponent,{
          data:{
            mobile:this.signupForm.get("mobile").value
          },
          disableClose:true
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if(result){        
            this.isMobileVerified = true;
            this.mobileTooltip = "verified, can't change";
            this.onSubmit(this.terms.nativeElement.checked);
          }else{
            this.signupForm.get("mobile").setValue("");
          }
        });
        return false;
      }
      return true;
  }
  register(data:any){
    this.showSpinner = true;
    console.log(data);
    this.registerLoginService.registerAsVendor(data).subscribe(res=>{
      this.showSpinner = false;
       if(res["success"]){
         localStorage.setItem("vid",res["data"]["id"]);
         localStorage.setItem("vname",res["data"]["username"]);
         this.registerLoginService.hasLoggedIn.next(true);         
         this.chatService.hasRecievedMessage.next("no");
         this.chatService.hasRecievedNotification.next("no");
         this.setVendorStatusAndRedirect();
       }else{
         this.showSnackbar(res["message"],true,"close");
       }
    },error=>{
      this.showSpinner = false;
      this.showSnackbar("Internal Server error",true,"close");
    });
  }

  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  setVendorStatusAndRedirect(){
    this.registerLoginService.getVendorBasicDetails(localStorage.getItem('vid')).subscribe(res=>{
      if(res["success"]){
        localStorage.setItem("vstatus",res["data"]["profileCompletionStatus"]);
        this.registerLoginService.profileStatus.next(res["data"]["profileCompletionStatus"]);
        this.showSnackbar("Registration successful!",true,"close");
        this.router.navigate(["select-package"]);
      }else{
        this.showSnackbar("Server error!",true,"close");
      }
    },error=>{      
      this.showSnackbar("Connection error!",true,"close");
    });    
  }
  ngOnInit(): void {
  }

  ngOnDestroy(): void{
  }

}