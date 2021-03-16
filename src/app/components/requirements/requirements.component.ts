import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { RequirementService } from 'src/app/services/requirement.service';
import {RegisterLoginService} from 'src/app/services/register-login.service';
import { SendQouteComponent } from 'src/app/dialogs/send-qoute/send-qoute.component';
import { ReportRequirementComponent } from 'src/app/dialogs/report-requirement/report-requirement.component';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class RequirementsComponent implements OnInit {

  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  selectedTab:number = 0;
  isGettingRequirements:boolean = true;
  isGettingRequirementsSuccess:boolean = true;
  requirements:any[] = [];
  categories:any[] = [];
  pageNo:number = 0;
  pageSize:number = 9;
  config:any = {};
  constructor(
    private snackBar:MatSnackBar,
    private requirementService:RequirementService,
    private registerLoginService:RegisterLoginService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getCategories(); 
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  getCategories(){
    this.registerLoginService.getCategories().subscribe(res=>{
      if(res["success"]){
        this.categories = res["data"];
        this.getRequirements(0,this.pageSize);
      }
    },error=>{
      this.showSnackbar("Server error",true,"close");
    });
  }
  getRequirements(pageNo:number,pageSize:number){
    this.isGettingRequirements = true;
    this.config["totalItems"] = 0;
    this.config["currentPage"] = pageNo+1;
    this.config["itemsPerPage"] = pageSize;
    this.requirementService.getRequirements(localStorage.getItem("vid"),this.pageNo,this.pageSize).subscribe(res=>{
      this.isGettingRequirements = false;
      if(res["success"]){
        this.requirements = res["data"]["content"];
        this.requirements.map(obj=>{
          let categoryName = this.categories.filter(category=>{
            return category.categoryId == obj.categoryId;
          })[0]["categoryName"];
          return obj.categoryId = categoryName;
        });   
        this.config["totalItems"] = res["data"]["totalElements"]; 
      }else{
        this.isGettingRequirementsSuccess = false;
      }
    },error=>{
      this.isGettingRequirements = false;
      this.isGettingRequirementsSuccess = false;
    });
  }
  sendQuote(requirementId:string,event:any){
    event.stopPropagation()
    const dialogRef = this.dialog.open(SendQouteComponent,{
      data:{
        requirementId:requirementId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){        
        this.showSnackbar("Quote send successfully!",true,"close");
      }
    });
  }
  reportRequirement(requirementId:string){
    const dialogRef = this.dialog.open(ReportRequirementComponent,{
      data:{
        requirementId:requirementId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){        
        this.showSnackbar("Requirement reported successfully!",true,"close");
      }
    });
  }
  pageChange(newPage: number){
    this.pageNo = newPage-1;
    this.getRequirements(this.pageNo,this.pageSize);
  }
  
}
