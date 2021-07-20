import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { RefferalCodeComponent } from 'src/app/dialogs/refferal-code/refferal-code.component';
import { RequestAgentRemovalComponent } from 'src/app/dialogs/request-agent-removal/request-agent-removal.component';
import { AgentService } from 'src/app/services/agent.service';
import { RegisterLoginService } from 'src/app/services/register-login.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {
  //based on membership
  agent:any = {};
  agentToAdd:any = {};
  isAgent:boolean = false;
  isRequesting:boolean = false;
  isRefferalCorrect:boolean = false;
  galleryMaxCount:number = 10;
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  isChanging:boolean = false;
  changePasswordForm: FormGroup;
  isGettingProfileDetails:boolean = true;
  isGettingServiceAndLocationDetails:boolean = true;
  isGettingGalleryDetails:boolean = false;
  isSavingDetails:boolean = false;
  isSavingServiceAndLocation:boolean = false;
  isUploading:boolean = false;
  companyDetailsForm: FormGroup;
  categoryAndLocationsForm: FormGroup;
  vendorLocation:string = "NA";
  categoryName:any = "Loading...";
  categoryId:any;

  profileProgress:number = 0;
  logoProgress:number = 0;
  galleryProgress:number = 0;
  brochureProgress:number = 0;

  profilePreview = [];
  logoPreview = [];
  existingGallery = [];
  brochureFilename:string = "";

  galleryFiles:File[] = [];
  profileFile:File=null;
  logoFile:File=null;
  brochureFile:File=null;

  locations:any = [];
  preferredLocations:any = [];
  subCategories:any = [];
  vendorSubCategories:any = [];

  latitude = 10.0088142;
  longitude = 76.3156612;

  constructor(
    private registerLoginService:RegisterLoginService,
    private snackBar:MatSnackBar,
    private fb:FormBuilder,
    private agentService:AgentService,
    public dialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.companyDetailsForm = this.fb.group({
      companyName: ['', Validators.required],
      longitude:['',Validators.required],
      latitude:['',Validators.required],
      gstNumber:[''],
      address:['',Validators.required],
      whatsappNum:['',Validators.pattern("^[0-9]{10}$")],
      fbLink:[''],
      youtubeLink:[''],
      websiteLink:[''],
      location:['none',Validators.required],
      about:['',Validators.required]
    });  
    this.categoryAndLocationsForm = this.fb.group({
      subCategories:['',Validators.required],
      preferredLocations:['',Validators.required]
    });
    this.changePasswordForm = this.fb.group({
      password: ['', Validators.required],
      repassword:['',Validators.required]
    });
    this.getAllLocation();  
    this.getAgentDetails();
  }
  getAgentDetails(){
    this.agentService.getAgentDetailsByVendorId(localStorage.getItem("vid")).subscribe(res=>{
      if(res["success"]){
        this.isAgent = res["data"]?true:false;
        this.agent = res["data"];
      }else{
        this.isAgent = false;
        this.showSnackbar("Agent detail error!",true,"close");
      }
    },error=>{
      this.isAgent = false;
      this.showSnackbar("Connection error!",true,"close");
    });
  }
  getAllLocation(){
    this.registerLoginService.getAllLocations().subscribe(res=>{
      if(res["success"]){
        this.locations = res["data"];
        this.getCompanyDetails();
      }else{
        this.isGettingProfileDetails = false;
        this.showSnackbar("Vendor detail error!",true,"close");
      }
    },error=>{
      this.isGettingProfileDetails = false;
      this.showSnackbar("Connection error!",true,"close");
    });
  }
  getCompanyDetails(){
    this.registerLoginService.getVendorProfileDetails(localStorage.getItem("vid")).subscribe(res=>{
      this.isGettingProfileDetails = false;
      if(res["success"]){
        this.vendorLocation = res["data"]["location"];
        this.setExistingImages(res["data"]);
        this.changeCoordinates(parseFloat(res["data"]["latitude"]),parseFloat(res["data"]["longitude"]));
        if((res["data"]["whatsappNum"])&&(res["data"]["whatsappNum"]!="")){
          res["data"]["whatsappNum"] = res["data"]["whatsappNum"].slice(-10);
        }        
        this.companyDetailsForm.patchValue(res["data"]);
        this.getVendorServiceDetails();
      }else{
       this.showSnackbar("Vendor details not found!",true,"close");
      }
   },error=>{
     this.isGettingProfileDetails = false;
     this.showSnackbar("Connection error!",true,"close");
   });
  }
  
  getVendorServiceDetails(){
    this.registerLoginService.getSubCategoriesByVendorId(localStorage.getItem("vid")).subscribe(res=>{
      if(res["success"]){
        this.vendorSubCategories = res["data"];
        this.categoryName = [...new Set(this.vendorSubCategories.map(item => item.categoryName))][0];
        this.categoryId = [...new Set(this.vendorSubCategories.map(item => item.categoryId))][0];
        this.getAllSubCategories();
      }else{
        this.isGettingServiceAndLocationDetails = false;
        this.showSnackbar("Vendor service details not found!",true,"close");
      }
    },error=>{
      this.isGettingServiceAndLocationDetails = false;
      this.showSnackbar("Connection error!",true,"close");
    });
  }
  getAllSubCategories(){
    this.registerLoginService.getSubCategoriesById(this.categoryId).subscribe(res=>{
      if(res["success"]){
        this.subCategories = res["data"];
        this.categoryAndLocationsForm.get("subCategories").setValue([...new Set(this.vendorSubCategories.map(item => item.subCategoryName))]);
        this.getPreferredLocations();
      }else{
        this.isGettingServiceAndLocationDetails = false;
        this.showSnackbar("Services not found!",true,"close");
      }
    },error=>{
      this.isGettingServiceAndLocationDetails = false;
      this.showSnackbar("Connection error!",true,"close");
    });
  }
  getPreferredLocations(){
    this.registerLoginService.getPreferredLocations(localStorage.getItem("vid")).subscribe(res=>{
      if(res["success"]){
        this.preferredLocations = res["data"];
        this.categoryAndLocationsForm.get("preferredLocations").setValue(this.preferredLocations);
        this.isGettingServiceAndLocationDetails = false;
      }else{
        this.isGettingServiceAndLocationDetails = false;
        this.showSnackbar("Preferred locations not found!",true,"close");
      }
    },error=>{
      this.isGettingServiceAndLocationDetails = false;
      this.showSnackbar("Connection error!",true,"close");
    });
  }
  setExistingImages(data:any){
    this.getGalleryImages();    
    if((data["profilePic"])&&(data["profilePic"])!=""){
      this.profilePreview.push("https://mynestonline.com/collection/images/company-profile/"+data["profilePic"]);  
    }
    if((data["logo"])&&(data["logo"])!=""){
      this.logoPreview.push("https://mynestonline.com/collection/images/company-logo/"+data["logo"]);  
    }
    if((data["brochureFilePath"])&&(data["brochureFilePath"])!=""){
      this.brochureFilename= data["brochureFilePath"];  
    }
  }
  getGalleryImages(){
    this.existingGallery = [];
    this.isGettingGalleryDetails = true;
    this.registerLoginService.getGalleryImages(localStorage.getItem("vid")).subscribe(res=>{
      this.isGettingGalleryDetails = false;
       if(res["success"]){
          this.galleryMaxCount = 10 - res["data"].length;
          this.existingGallery = res["data"];
       }
    },error=>{
      this.isGettingGalleryDetails = false;
      this.showSnackbar("Gallery connection error!",true,"close");
    })
  }
  changePassword(){
    if(this.changePasswordForm.valid){
      if(this.changePasswordForm.get("password").value==this.changePasswordForm.get("repassword").value){
        this.showSnackbar("Changing password...",false,"");
        this.isChanging = true;
        let formData = {};
        formData["newPassword"]=this.changePasswordForm.get("password").value;
        formData["userId"]=localStorage.getItem("vid");
        this.registerLoginService.changePassword(formData).subscribe(res=>{
          this.isChanging = false;
          if(res["success"]){
            this.changePasswordForm.reset();
            this.showSnackbar("Password changed successfully!",true,"close");
          }else{
            this.showSnackbar("Server error!",true,"close");
          }
        },error=>{
          this.isChanging = false;
          this.showSnackbar("Connection error!",true,"close");
        });
      }else{
        this.showSnackbar("Password don't match!",true,"okay");
      }      
    }else{
      this.showSnackbar("Please fill all required fields",true,"okay");
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
  setLocation(event:any){
    this.changeCoordinates(event.coords.lat,event.coords.lng);
  }
  markerDragEnd(event:any){
    this.changeCoordinates(event.coords.lat,event.coords.lng);
  }
  changeCoordinates(lat:any,lng:any){
    this.latitude = lat;
    this.longitude = lng;
    this.companyDetailsForm.get("latitude").setValue(lat);
    this.companyDetailsForm.get("longitude").setValue(lng);
  }
  setLat(){
    this.latitude = parseFloat(this.companyDetailsForm.get("latitude").value);
  }
  setLng(){
    this.longitude = parseFloat(this.companyDetailsForm.get("longitude").value);
  }
  companyFormSubmit(){
    if(!this.companyDetailsForm.get("whatsappNum").hasError("pattern")){
    if(this.companyDetailsForm.valid){
      if(this.companyDetailsForm.get("location").value!="none"){
        this.showSnackbar("Saving details...",false,"");
        this.isSavingDetails = true;
        let formData = this.companyDetailsForm.value;
        formData["vendorId"]=localStorage.getItem("vid");
        formData["whatsappNum"]="91"+formData["whatsappNum"];
        this.registerLoginService.editVendorCompanyDetails(formData).subscribe(res=>{
          this.isSavingDetails = false;
          if(res["success"]){
            this.showSnackbar("Profile details updated!",true,"close");
            this.registerLoginService.hasLogoChanged.next(true);
          }else{
            this.showSnackbar("Server error!",true,"close");
          }
        },error=>{
          this.isSavingDetails = false;
          this.showSnackbar("Connection error!",true,"close");
        });
      }else{
        this.showSnackbar("Please select company location",true,"okay");
      }      
      }else{
        this.showSnackbar("Please fill all required fields",true,"okay");
      } 
    }else{
      this.showSnackbar("Invalid watsapp number",true,"close");
    }         
  }
  categoryAndLocationFormSubmit(){
    if(this.categoryAndLocationsForm.valid){
      this.showSnackbar("Saving details...",false,"");
      this.isSavingServiceAndLocation = true;      
      this.editServices();
    }else{
      this.showSnackbar("Please fill all required fields",true,"okay");
    } 
  }
  editServices(){
    let formData = {};
    formData["vendorId"] = localStorage.getItem("vid");
    formData["categoryId"] = this.categoryId;
    formData["subCategories"] = this.categoryAndLocationsForm.get("subCategories").value;
    this.registerLoginService.editServices(formData).subscribe(res=>{
      if(res["success"]){
        this.editPreferredLocations();
      }else{
        this.isSavingServiceAndLocation = false;
        this.showSnackbar("Server error for services!",true,"close");
      }
    },error=>{
      this.isSavingServiceAndLocation = false;
      this.showSnackbar("Connection error!",true,"close");
    });
  }
  editPreferredLocations(){
    let formData = {};
    formData["locations"] = this.categoryAndLocationsForm.get("preferredLocations").value;
    formData["vendorId"] = localStorage.getItem("vid");
    this.registerLoginService.editPreferredLocations(formData).subscribe(res=>{
      this.isSavingServiceAndLocation = false;
      if(res["success"]){
        this.showSnackbar("Updated successfully!",true,"close");
      }else{
        this.showSnackbar("Server error for locations!",true,"close");
      }
    },error=>{
      this.isSavingServiceAndLocation = false;
      this.showSnackbar("Connection error!",true,"close");
    });
  }
  onProfileSelect(event:any){
    this.profileFile = event.target.files[0];
    if(this.profileFile){  
      this.uploadProfilePic(event);
    }
  }
  onLogoSelect(event:any){
    this.logoFile = event.target.files[0];
    if(this.logoFile){  
      this.uploadLogo(event);
    }    
  }
  onBrochureSelect(event:any){
    this.brochureFile = event.target.files[0];
    if(this.brochureFile){  
      this.uploadBrochure(event);
    }     
  }
  onGallerySelect(event:any){
    this.galleryFiles = event.target.files;
    if(this.galleryFiles.length){
      if(this.galleryFiles.length > this.galleryMaxCount){
        this.showSnackbar("Oops! max "+this.galleryMaxCount+" more gallery images",true,"close");
      }else{
        this.uploadGalleryPic(event);       
      }
    }    
  }
  uploadProfilePic(fileEvent:any){
    this.isUploading =true;
    this.showSnackbar("Please be patient! uploading profile pic...",true,"okay");
    const uploadData = new FormData();
    uploadData.append('profilePic', this.profileFile);
    this.registerLoginService.uploadProfilePic(uploadData,localStorage.getItem("vid")).subscribe(
    (event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          this.profilePreview = [];
          this.profileProgress = 1;
          break;
        case HttpEventType.ResponseHeader:
          break;
        case HttpEventType.UploadProgress:
          this.profileProgress = Math.round(event.loaded / event.total * 100);
          break;
        case HttpEventType.Response:
          this.isUploading = false;
          if(event.body["success"]){
            this.showSnackbar("Uploaded profile pic",true,"close");            
            this.profileFile = null;
            var reader = new FileReader();   
            reader.onload = (event:any) => {
              this.profilePreview.push(event.target.result);  
            } 
            reader.readAsDataURL(fileEvent.target.files[0]);
          }else{
            this.showSnackbar("Server error",true,"close");
          }
          setTimeout(() => {
            this.profileProgress = 0;
          }, 1500);
          break;
        default:
          this.profileProgress = 0;
          return `Unhandled event: ${event.type}`;
      }
    },error=>{
        this.profileProgress = 0;
        this.isUploading = false;
        this.showSnackbar("Connection Error!",true,"close");
    }); 
}
uploadLogo(fileEvent:any){
  this.isUploading =true;
  this.showSnackbar("Please be patient! uploading logo...",true,"okay");
  const uploadData = new FormData();
  uploadData.append('logo', this.logoFile);
  this.registerLoginService.uploadLogoPic(uploadData,localStorage.getItem("vid")).subscribe((event: HttpEvent<any>) => {
    switch (event.type) {
      case HttpEventType.Sent:
        this.logoPreview = [];
        this.logoProgress = 1;
        break;
      case HttpEventType.ResponseHeader:
        break;
      case HttpEventType.UploadProgress:
        this.logoProgress = Math.round(event.loaded / event.total * 100);
        break;
      case HttpEventType.Response:
        this.isUploading = false;
        if(event.body["success"]){
          this.showSnackbar("Uploaded logo",true,"close");            
          this.logoFile = null;
          var reader = new FileReader();   
          reader.onload = (event:any) => {
            this.logoPreview.push(event.target.result);  
          } 
          reader.readAsDataURL(fileEvent.target.files[0]);
          this.registerLoginService.hasLogoChanged.next(true);
        }else{
          this.showSnackbar("Server error",true,"close");
        }
        setTimeout(() => {
          this.logoProgress = 0;
        }, 1500);
        break;
      default:
        this.logoProgress = 0;
        return `Unhandled event: ${event.type}`;
    }
  },error=>{
      this.logoProgress = 0;
      this.isUploading = false;
      this.showSnackbar("Connection Error!",true,"close");
  });
}
uploadBrochure(fileEvent:any){
  this.isUploading =true;
  this.showSnackbar("Please be patient! uploading brochure...",true,"okay");
  const uploadData = new FormData();
  uploadData.append('brochure', this.brochureFile);
  this.registerLoginService.uploadBrochure(uploadData,localStorage.getItem("vid")).subscribe((event: HttpEvent<any>) => {
    switch (event.type) {
      case HttpEventType.Sent:
        this.brochureFilename = "";
        this.brochureProgress = 1;
        break;
      case HttpEventType.ResponseHeader:
        break;
      case HttpEventType.UploadProgress:
        this.brochureProgress = Math.round(event.loaded / event.total * 100);
        break;
      case HttpEventType.Response:
        this.isUploading = false;
        if(event.body["success"]){
          this.showSnackbar("Uploaded brochure",true,"close");            
          this.brochureFilename = this.brochureFile.name;    
        }else{
          this.showSnackbar("Server error",true,"close");
        }
        setTimeout(() => {
          this.brochureProgress = 0;
        }, 1500);
        break;
      default:
        this.brochureProgress = 0;
        return `Unhandled event: ${event.type}`;
    }
  },error=>{
      this.brochureProgress = 0;
      this.isUploading = false;
      this.showSnackbar("Connection Error!",true,"close");
  });
}
uploadGalleryPic(fileEvent:any){
  this.isUploading =true;
  this.showSnackbar("Please be patient! uploading gallery pics...",true,"okay");
  const uploadData = new FormData();
  for  (var i =  0; i <  this.galleryFiles.length; i++)  {  
    uploadData.append('images', this.galleryFiles[i]);
  } 
  this.registerLoginService.uploadGalleryPic(uploadData,localStorage.getItem("vid")).subscribe((event: HttpEvent<any>) => {
    switch (event.type) {
      case HttpEventType.Sent:
        this.galleryProgress = 1;
        break;
      case HttpEventType.ResponseHeader:
        break;
      case HttpEventType.UploadProgress:
        this.galleryProgress = Math.round(event.loaded / event.total * 100);
        break;
      case HttpEventType.Response:
        this.isUploading = false;
        if(event.body["success"]){
          this.showSnackbar("Uploaded gallery pics",true,"close");   
          this.galleryFiles = [];
          this.getGalleryImages();  
        }else{
          this.showSnackbar("Server error",true,"close");
        }
        setTimeout(() => {
          this.galleryProgress = 0;
        }, 1500);
        break;
      default:
        this.galleryProgress = 0;
        return `Unhandled event: ${event.type}`;
    }
  },error=>{
      this.galleryProgress = 0;
      this.isUploading = false;
      this.showSnackbar("Connection Error!",true,"close");
  });
}

deleteGalleryImage(url:string){
  this.showSnackbar("Deleting image...",false,"");
  this.isGettingGalleryDetails = true;
  this.registerLoginService.deleteGalleryImage(localStorage.getItem("vid"),url).subscribe(res=>{
    if(res["success"]){
      this.showSnackbar("Deleted successfully!",true,"close");
      this.getGalleryImages();
    }else{
      this.isGettingGalleryDetails = false;
      this.showSnackbar("Server error on deleting!",true,"close");
    }
  },error=>{
    this.showSnackbar("Connection error!",true,"close");
  });
}

removeAgent(){
  const dialogRef = this.dialog.open(RequestAgentRemovalComponent,{
    data:this.agent.agentId
  });

  dialogRef.afterClosed().subscribe(result => {
    if(result){ 
      this.showSnackbar("Requested for agent removal, be notified when done!",true,"close");    
    }
  });
}
openRefferalDialog(){
  const dialogRef = this.dialog.open(RefferalCodeComponent,{});

  dialogRef.afterClosed().subscribe(result => {
    if(result){ 
      if(result["isAgent"]){  
        if(this.vendorLocation == result["agent"]["location"]){
          this.isRefferalCorrect = true;
          this.agentToAdd = result["agent"];
        }else{
          this.showSnackbar("Oops! Agent-Vendor Locations Not Same.",true,"close");
        }
      }       
    }
  });
}
removeAgentRefferal(){
  this.isRefferalCorrect = false;
  this.agentToAdd = {};
}
addAgentRequest(){  
      this.isRequesting = true;
      this.agentService.addAgent(this.agentToAdd["agentId"],localStorage.getItem("vid")).subscribe(res=>{
        this.isRequesting = false;
        if(res["success"]){
          this.showSnackbar("Requested For Agent Addition!",true,"close");
          setTimeout(()=>{
            this.showSnackbar("Will be notified on Addition!",true,"close");
          },3000);
          this.removeAgentRefferal();
        }else{
          this.showSnackbar("fetch server error",true,"close");
        }
      },error=>{
        this.isRequesting = false;
        this.showSnackbar("fetch connection error",true,"close");
      });
}
}
