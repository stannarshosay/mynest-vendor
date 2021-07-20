import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-get-ad-link',
  templateUrl: './get-ad-link.component.html',
  styleUrls: ['./get-ad-link.component.css']
})
export class GetAdLinkComponent implements OnInit {

  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  link = new FormControl('',Validators.required);
  constructor(
    public dialogRef: MatDialogRef<GetAdLinkComponent>,
    private snackBar:MatSnackBar
  ) { }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  } 
  dismiss(data:any){
    this.dialogRef.close(data);
  } 
  getLink(){
    if(this.link.valid){
      this.dismiss(this.link.value);
    }else{
       this.showSnackbar("Please enter a valid redirect link",true,"close");
    }
  }

}
