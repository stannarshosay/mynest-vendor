import { Component, NgZone, OnInit } from '@angular/core';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RegisterLoginService } from 'src/app/services/register-login.service';
declare var Razorpay: any;
@Component({
  selector: 'app-select-package',
  templateUrl: './select-package.component.html',
  styleUrls: ['./select-package.component.css']
})
export class SelectPackageComponent implements OnInit {

  showSpinner:boolean = false;
  isProccessing:boolean = false;
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)"; 
  packages:any = [];
  options:any = {};
  planChoosed:any;
  orderId:string = "";
  constructor(
    private registerLoginService:RegisterLoginService,
    private snackBar:MatSnackBar,
    private router:Router,
    private zone:NgZone
  ) { }

  ngOnInit(): void {    
    let that = this;
    this.options = {
      "key": "rzp_test_AH9Z2L7Vuospz9",
      "amount": "50000",
      "currency": "INR",
      "name": "MyNest",
      "description": "Purchase your membership",
      "image": "https://mynestonline.com/vendor/assets/images/main-logo.png",
      "handler": function (response:any){
          that.zone.run(()=>that.saveMembership(response));
      },
      "prefill": {
          "name": localStorage.getItem("vname"),
          // "email": "gaurav.kumar@example.com",
          // "contact": "9999999999"
      },
      "notes": {},
      "theme": {
          "color": "#039eba"
      }
    };
    this.getPlans();
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }

  getPlans(){
    this.registerLoginService.getAllPackages().subscribe(res=>{
       this.showSpinner =true;
       if(res["success"]){
          this.packages = res["data"].filter(obj=>
           obj.membershipName != "Bronze"
          ).reverse();
       }else{
         this.showSnackbar("No Plan details found!",true,"close");
       }
    },error=>{
      this.showSpinner =true;
      this.showSnackbar("Connection Error!",true,"close");
    });
  }
  
  choosePackage(plan:any){
    this.planChoosed = plan;
    if(plan.sellingPrice !="0"){
        this.createOrderAndAcceptPayment();        
    }else{
      this.saveMembershipForFree();
    }
    
  }
  createOrderAndAcceptPayment(){
    this.isProccessing = true;
    this.showSnackbar("Please wait...",false,"");
    let that = this;
    let params = {};
    params["totalPrice"] = this.planChoosed.sellingPrice;
    params["vendorId"] = localStorage.getItem("vid");
    params["orderType"] = "MEMBERSHIP";
    this.registerLoginService.createOrder(params).subscribe(res=>{
      this.isProccessing = false;
      if(res["success"]){
        this.showSnackbar("Please complete payment!",true,"close");
        this.orderId = res["data"]["orderId"]; 
        this.options["amount"] = this.planChoosed.sellingPrice+"00";
        this.options["description"] = "Purchase "+this.planChoosed.membershipName+ " Membership";
        this.options["order_id"] = this.orderId;
        var rzp1 = new Razorpay(this.options);
        rzp1.open();
        rzp1.on('payment.failed', function (response:any){
          that.showSnackbar(response.error.code+": "+response.error.reason+" "+response.error.description,true,"");
          console.log(response);          
        });
      }else{
        this.showSnackbar("Connection Error!",true,"close");
      }
    },error=>{
      this.showSnackbar("Connection Error!",true,"close");
      this.isProccessing = false;
    });    
  }
  saveMembershipForFree(){
    this.isProccessing = true;
    this.showSnackbar("Please wait...",false,"");
    let params = {};
    params["membershipId"] = this.planChoosed.membershipId;
    params["vendorId"] = localStorage.getItem("vid");
    this.registerLoginService.setPackageSubscriptionForFree(params).subscribe(res=>{
      this.isProccessing = false;
        if(res["success"]){
          this.showSnackbar("Subscribed successfully!",true,"close");
          localStorage.setItem("vstatus","SUBSCRIBED");
          this.registerLoginService.profileStatus.next("SUBSCRIBED");
          this.router.navigate(["/profile"]);
        }else{
          this.showSnackbar("Internal Server Error!",true,"close");
        }
    },error=>{
      this.isProccessing = false;
      this.showSnackbar("Connection Error!",true,"close");
    });
  }
  saveMembership(response:any){
    
    // alert(response.razorpay_payment_id);
    // alert(response.razorpay_order_id);
    // alert(response.razorpay_signature);
    this.isProccessing = true;
    this.showSnackbar("Please wait verifying payment...",false,"");
    let params = {};
    params["membershipId"] = this.planChoosed.membershipId;
    params["vendorId"] = localStorage.getItem("vid");
    params["paymentId"] = response.razorpay_payment_id;
    params["orderId"] = this.orderId;
    params["signature"] = response.razorpay_signature;
    this.registerLoginService.setPackageSubscription(params).subscribe(res=>{
      this.isProccessing = false;
        if(res["success"]){
          this.showSnackbar("Subscribed successfully!",true,"close");
          localStorage.setItem("vstatus","SUBSCRIBED");
          this.registerLoginService.profileStatus.next("SUBSCRIBED");
          this.router.navigate(["/profile"]);
        }else{
          this.showSnackbar("Internal Server Error!",true,"close");
        }
    },error=>{
      this.isProccessing = false;
      this.showSnackbar("Connection Error!",true,"close");
    });
  }
  logout(){
    localStorage.setItem("vid","");
    localStorage.setItem("vname","");
    localStorage.setItem("vstatus","");
    this.registerLoginService.hasLoggedIn.next(false);
    this.router.navigate(['login']);
  }
}
