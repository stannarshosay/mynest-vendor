import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { GetAdLinkComponent } from 'src/app/dialogs/get-ad-link/get-ad-link.component';
import { AdvertisementService } from 'src/app/services/advertisement.service';
import moment from 'moment';
@Component({
  selector: 'app-my-advertisements',
  templateUrl: './my-advertisements.component.html',
  styleUrls: ['./my-advertisements.component.css']
})
export class MyAdvertisementsComponent implements OnInit {

  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  isGettingSlots:boolean = true;
  isGettingSlotsSuccess:boolean = true;
  isUploading:boolean = false;
  adProgress:number = 0;
  adFile:File=null;
  adId:string;
  slots:any[] = [];
  link:any = null;

  constructor(
    private snackBar:MatSnackBar,
    private adService:AdvertisementService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getSlots(); 
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  getSlots(){
    this.isGettingSlots = true;
    this.isGettingSlotsSuccess = true;    
    this.adService.getBookedSlots(localStorage.getItem("vid")).subscribe(res=>{
      this.isGettingSlots = false;
      if(res["success"]){
        this.slots = res["data"];        
      }else{
        this.isGettingSlotsSuccess = false;
      }
    },error=>{
      this.isGettingSlots = false;
      this.isGettingSlotsSuccess = false;
    });
  }
  onAdSelect(event:any,vendorAdId:string){
    var _size:any,name:string,file:File;
    _size = event.target.files[0].size;
    name = event.target.files[0].name; 
    file = event.target.files[0]; 
    var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),i=0;
        while(_size>900)
        {
          _size/=1024;
          i++;
        }
    if((((Math.round(_size*100)/100)>1)&&(i==2))||(i==3)){
      this.showSnackbar("File size of "+name+" was larger than 1 MB",true,"okay");     
    }else{
      this.checkDimensions(file,vendorAdId);
    }    
  }
  checkDimensions(file:File,vendorAdId:any){
    var reader = new FileReader();   
    reader.onload = (event:any) => {  
      var img = new Image();    
      img.onload = () => {
          if((img.width == 300)&&(img.height == 250)){
            this.adFile = file;
            if(this.adFile){  
                const dialogRef = this.dialog.open(GetAdLinkComponent,{
                  disableClose:true         
                });
            
                dialogRef.afterClosed().subscribe(result => {          
                  this.link = result;
                  this.uploadAdPic(vendorAdId);
                });
            }
          }else{
            this.showSnackbar("File dimension of "+file.name+" is incorrect",true,"okay");            
          }
      };
      img.src = event.target.result;
    } 
    reader.readAsDataURL(file);
  }
  uploadAdPic(vendorAdId:string){
    this.adId = vendorAdId;
    this.isUploading =true;
    this.showSnackbar("Please be patient! uploading ad pic...",true,"okay");
    const uploadData = new FormData();
    uploadData.append('adPic', this.adFile);
    this.adService.uploadAdPic(uploadData,vendorAdId,this.link).subscribe(
    (event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          this.adProgress = 1;
          break;
        case HttpEventType.ResponseHeader:
          break;
        case HttpEventType.UploadProgress:
          this.adProgress = Math.round(event.loaded / event.total * 100);
          break;
        case HttpEventType.Response:
          this.isUploading = false;
          if(event.body["success"]){
            this.showSnackbar("Uploaded Ad pic",true,"close");            
            this.adFile = null;
            this.link = null;
            this.getSlots();
          }else{
            this.showSnackbar("Server error",true,"close");
          }
          setTimeout(() => {
            this.adProgress = 0;
          }, 1500);
          break;
        default:
          this.adProgress = 0;
          return `Unhandled event: ${event.type}`;
      }
    },error=>{
        console.log(error);
        this.adProgress = 0;
        this.isUploading = false;
        this.showSnackbar("Connection Error!",true,"close");
    }); 
}
getBeautifiedDate(dateString:string){
  return moment(dateString, "DD/MM/YYYY").format('Do MMM YYYY');
}
}
