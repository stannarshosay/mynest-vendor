import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { RefferalCodeComponent } from 'src/app/dialogs/refferal-code/refferal-code.component';
import { RegisterLoginService } from 'src/app/services/register-login.service';
@Component({
  selector: 'app-profile-stepper',
  templateUrl: './profile-stepper.component.html',
  styleUrls: ['./profile-stepper.component.css']
})
export class ProfileStepperComponent implements OnInit {
  //based on membership
  galleryMaxCount:number = 10;
  
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  galleryInfo = [];
  maxChars:string = "800";
  isAgent:boolean = false;
  agent:any = {};
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

  companyDetailsForm: FormGroup;
  categoryAndLocationsForm: FormGroup;
  isCompletedCompanyDetails:boolean = false;
  isCompletedCategoryAndLocations:boolean = false;
  isGettingGalleryDetails:boolean = false;
  isCompletedRegistration:boolean = false;
  isSaving:boolean = false;
  isUploading:boolean = false;
  categoryFromSelect:string;
  latitude = 10.0088142;
  longitude = 76.3156612;
  categories:any = [];
  subCategories:any = [];
  locations:any = [];
  constructor(
    private fb:FormBuilder,
    private registerLoginService:RegisterLoginService,
    private cdr:ChangeDetectorRef,
    private snackBar:MatSnackBar,
    private router:Router,
    private dialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.companyDetailsForm = this.fb.group({
      companyName: ['', Validators.required],
      longitude:[this.latitude,Validators.required],
      latitude:[this.longitude,Validators.required],
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
      categoryId:['',Validators.required],
      subCategories:['',Validators.required],
      preferredLocations:['',Validators.required]
    });
    this.registerLoginService.getCurrentPosition().then(pos=>{
      this.changeCoordinates(pos.lat,pos.lng)
    });
    this.registerLoginService.getCategories().subscribe(res=>{
      if(res["success"]){
        this.categories = res["data"];
      }
    })
    this.registerLoginService.getAllLocations().subscribe(res=>{
      if(res["success"]){
        this.locations = res["data"];
      }
    });
    this.openRefferalDialog();
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
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  companyFormSubmit(stepper:MatStepper){
   if(!this.companyDetailsForm.get("whatsappNum").hasError("pattern")){
    if(this.companyDetailsForm.valid){
      if(this.companyDetailsForm.get("location").value!="none"){       
        this.isCompletedCompanyDetails = true;
        this.cdr.detectChanges();
        stepper.next();
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
  categoryAndLocationFormSubmit(stepper:MatStepper){
    if(this.categoryAndLocationsForm.valid){
      this.isCompletedCategoryAndLocations = true;
      this.cdr.detectChanges();
      this.setFormAndSaveChanges();
      stepper.next();
    }else{
      this.showSnackbar("Please fill all required fields",true,"okay");
    } 
  }
  setFormAndSaveChanges(){
    this.showSnackbar("Saving Changes...",false,"");
    this.isSaving = true;
    let mergedFormData = {...this.companyDetailsForm.value,...this.categoryAndLocationsForm.value};
    mergedFormData["vendorId"] = localStorage.getItem("vid");
    mergedFormData["categoryId"] = Number(mergedFormData["categoryId"]);
    if(this.companyDetailsForm.get("whatsappNum").value){
      mergedFormData["whatsappNum"] = "91"+mergedFormData["whatsappNum"];
    }
    if(this.isAgent){
      mergedFormData["agentId"] = this.agent.agentId;
      mergedFormData["location"] = this.agent.location;
    }
    this.registerLoginService.saveProfileDetails(mergedFormData).subscribe(res=>{
      this.isSaving = false;
      if(res["success"]){  
        localStorage.setItem("vstatus","COMPLETED"); 
        this.registerLoginService.profileStatus.next("COMPLETED");   
        this.showSnackbar("Profile details saved!",true,"close");
      }else{
        this.showSnackbar("Oops! seems like you haven't registered",true,"close");
      }
    },error=>{
      console.log(error);
      this.isSaving = false;
      this.showSnackbar("Connection Error",true,"close");
    });    
  }
  categorySelected(){
    this.showSnackbar("Loading Services...",false,"");
      this.registerLoginService.getSubCategoriesById(this.categoryFromSelect).subscribe(res=>{
        if(res["success"]){
          this.subCategories = res["data"];
          this.showSnackbar("Services loaded!",true,"close");
        }
    });
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
  onProfileSelect(event:any){
    var _size = event.target.files[0].size;
    var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),i=0;
        while(_size>900)
        {
          _size/=1024;
          i++;
        }
    if((((Math.round(_size*100)/100)>800)&&(i==1))||(i==3)||(i==2)){
      this.showSnackbar("File size is larger than 800 KB",true,"okay");
    }else{
      this.profileFile = event.target.files[0];
      if(this.profileFile){  
        this.uploadProfilePic(event);
      }
    } 
  }
  onLogoSelect(event:any){
    var _size = event.target.files[0].size;
    var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),i=0;
        while(_size>900)
        {
          _size/=1024;
          i++;
        }
    if((((Math.round(_size*100)/100)>500)&&(i==1))||(i==3)||(i==2)){
      this.showSnackbar("File size is larger than 500 KB",true,"okay");
    }else{
      this.logoFile = event.target.files[0];
      if(this.logoFile){  
        this.uploadLogo(event);
      }  
    }    
  }
  onBrochureSelect(event:any){
    var _size = event.target.files[0].size;
    var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),i=0;
        while(_size>900)
        {
          _size/=1024;
          i++;
        }
    if((((Math.round(_size*100)/100)>5)&&(i==2))||(i==3)){
      this.showSnackbar("File size is larger than 5 MB",true,"okay");
    }else{
      this.brochureFile = event.target.files[0];
      if(this.brochureFile){  
        this.uploadBrochure(event);
      }   
    }     
  }
  onGallerySelect(event:any){
    var _size:any,name:string,file:File;
    if(event.target.files.length > this.galleryMaxCount){
      this.showSnackbar("Oops! max "+this.galleryMaxCount+" more gallery images",true,"close");
    }else{
      for(var j = 0; j<event.target.files.length;j++){
        _size = event.target.files[j].size;
        name = event.target.files[j].name; 
        file = event.target.files[j]; 
        var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),i=0;
            while(_size>900)
            {
              _size/=1024;
              i++;
            }
        if((((Math.round(_size*100)/100)>1)&&(i==2))||(i==3)){
          this.galleryInfo.push("File size of "+name+" was larger than 1 MB");
          setTimeout(()=>{
            if(this.galleryInfo.length){
              this.galleryInfo.shift();
            }
          },5000+(j*1000));
        }else{
          this.galleryFiles.push(file);
        } 
      }
      this.showSnackbar("Please wait...",true,"okay");
      setTimeout(()=>{
        if(this.galleryFiles.length){ 
          this.uploadGalleryPic(event);       
        } 
      },800);        
    } 
  }
  //for dimension restricted gallery upload use below function
  // onGallerySelect(event:any){
  //   var _size:any,name:string,file:File;
  //   if(event.target.files.length > this.galleryMaxCount){
  //     this.showSnackbar("Oops! max "+this.galleryMaxCount+" more gallery images",true,"close");
  //   }else{
  //     for(var j = 0; j<event.target.files.length;j++){
  //       _size = event.target.files[j].size;
  //       name = event.target.files[j].name; 
  //       file = event.target.files[j]; 
  //       var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),i=0;
  //           while(_size>900)
  //           {
  //             _size/=1024;
  //             i++;
  //           }
  //       if((((Math.round(_size*100)/100)>1)&&(i==2))||(i==3)){
  //         this.galleryInfo.push("File size of "+name+" was larger than 1 MB");
  //         setTimeout(()=>{
  //           if(this.galleryInfo.length){
  //             this.galleryInfo.shift();
  //           }
  //         },5000+(j*1000));
  //       }else{
  //         this.checkDimensions(file,j);
  //       } 
  //     }
  //     this.showSnackbar("Please wait...",true,"okay");
  //     setTimeout(()=>{
  //       if(this.galleryFiles.length){ 
  //         this.uploadGalleryPic(event);       
  //       } 
  //     },800);        
  //   } 
  // }
  checkDimensions(file:File,index:number){
    var reader = new FileReader();   
    reader.onload = (event:any) => {  
      var img = new Image();    
      img.onload = () => {
          if((img.width == 439)&&(img.height == 510)){
            this.galleryFiles.push(file);
          }else{
            this.galleryInfo.push("File dimension of "+file.name+" is incorrect");
            setTimeout(()=>{
              if(this.galleryInfo.length){
                this.galleryInfo.shift();
              }
            },5000+(index*1000));
          }
      };
      img.src = event.target.result;
    } 
    reader.readAsDataURL(file);
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
  goToDashboard(){
    this.isCompletedRegistration = true;
    this.cdr.detectChanges();
    this.router.navigate(["dashboard"]);
  }
  serviceFocused(){
    if(!this.categoryAndLocationsForm.get("categoryId").value){
      this.showSnackbar("Please choose a category",true,"okay");
    }
  }
  setLat(){
    this.latitude = parseFloat(this.companyDetailsForm.get("latitude").value);
  }
  setLng(){
    this.longitude = parseFloat(this.companyDetailsForm.get("longitude").value);
  }
  logout(){
    localStorage.setItem("vid","");
    localStorage.setItem("vname","");
    localStorage.setItem("vstatus","");
    this.registerLoginService.hasLoggedIn.next(false);
    this.router.navigate(['login']);
  }
  openRefferalDialog(){
    const dialogRef = this.dialog.open(RefferalCodeComponent,{});

    dialogRef.afterClosed().subscribe(result => {
      if(result){ 
        if(result["isAgent"]){
          this.agent = result["agent"];
          this.companyDetailsForm.get("location").setValue(this.agent["location"]);
          this.companyDetailsForm.get("location").disable();
          this.isAgent = result["isAgent"];
        }       
      }
    });
  }
  removeAgent(){
    this.agent = {};
    this.companyDetailsForm.get("location").setValue("none");
    this.companyDetailsForm.get("location").enable();
    this.isAgent = false;
  }
}
