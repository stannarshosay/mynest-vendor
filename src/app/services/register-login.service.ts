import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterLoginService {

  public hasLoggedIn = new BehaviorSubject<boolean>(false);
  public profileStatus = new BehaviorSubject<string>("COMPLETED");
  public hasLogoChanged = new BehaviorSubject<boolean>(false);
  public logoChangedValue = new BehaviorSubject<string>("");
  constructor(
    private http:HttpClient
  ) { 
    if(localStorage.getItem("vid")){
      this.hasLoggedIn.next(true);
    }
    if(localStorage.getItem("vstatus")){
      this.profileStatus.next(localStorage.getItem("vstatus"));
    }
  }
  getLoginSetStatus():Observable<boolean>{
    return this.hasLoggedIn.asObservable();
  }
  getProfileStatus():Observable<string>{
    return this.profileStatus.asObservable();
  }
  getLogoChangedValue():Observable<string>{
    return this.logoChangedValue.asObservable();
  }
  getLogoChangedStatus():Observable<boolean>{
    return this.hasLogoChanged.asObservable();
  }
  registerAsVendor(requestData:any):Observable<any>{
     return this.http.post("https://mynestonline.com/collection/api/register/vendor",requestData);
  }
  changePassword(paramData:any){
    return this.http.post("https://mynestonline.com/collection/api/change-pass",paramData);
  }
  getAllPackages():Observable<any>{
    return this.http.get("https://mynestonline.com/collection/api/membership-plans");
  }
  setPackageSubscriptionForFree(params:any){
    return this.http.post("https://mynestonline.com/collection/api/new-subscription/free",params);
  }
  setPackageSubscription(params:any){
    return this.http.post("https://mynestonline.com/collection/api/new-subscription",params);
  }
  createOrder(params:any){
    return this.http.post("https://mynestonline.com/collection/api/create-order",params);
  }
  getCategories(){
    return this.http.get("https://mynestonline.com/collection/api/categories");
  }
  getSubCategoriesById(categoryId:string){
    return this.http.post("https://mynestonline.com/collection/api/sub-category?categoryId="+categoryId,null);
  }
  getSubCategoriesByVendorId(vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/sub-category-vendor?vendorId="+vendorId,null);
  }
  getAllLocations(){
    return this.http.get("https://mynestonline.com/collection/api/locations");
  }
  getPreferredLocations(vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/preferred-locations?vendorId="+vendorId,null);
  }
  saveProfileDetails(params:any){
    return this.http.post("https://mynestonline.com/collection/api/profile-register",params);
  }
  uploadProfilePic(fileFormData:any,vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/add-profile-pic?vendorId="+vendorId,fileFormData,{
      reportProgress: true,
      observe: 'events'
    });
  }
  uploadLogoPic(fileFormData:any,vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/add-logo?vendorId="+vendorId,fileFormData,{
      reportProgress: true,
      observe: 'events'
    });
  }
  uploadBrochure(fileFormData:any,vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/add-brochure?vendorId="+vendorId,fileFormData,{
      reportProgress: true,
      observe: 'events'
    });
  }
  uploadGalleryPic(fileFormData:any,vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/save-gallery-images?vendorId="+vendorId,fileFormData,{
      reportProgress: true,
      observe: 'events'
    });
  }
  getCurrentPosition(): Promise<any>
  {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {

          resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
        },
        err => {
          reject(err);
        });
    });

  }
  login(username:string,password:string):Observable<any>{
    let params = {};
    params["username"] = username;
    params["password"] = password;
    return this.http.post("https://mynestonline.com/collection/api/authenticate/vendor",params);
  }
  getVendorBasicDetails(vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/vendor-basic?vendorId="+vendorId,null);
  }
  getVendorProfileDetails(vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/vendor-profile?vendorId="+vendorId,null);
  }
  editVendorCompanyDetails(formData:any){
    return this.http.post("https://mynestonline.com/collection/api/add-details",formData);
  }
  editServices(formData:any){
    return this.http.post("https://mynestonline.com/collection/api/edit-services",formData);
  }
  editPreferredLocations(formData:any){
    return this.http.post("https://mynestonline.com/collection/api/edit-pref-locations",formData);
  }
  getGalleryImages(vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/gallery-images?vendorId="+vendorId,null);
  }
  deleteGalleryImage(vendorId:string,imageName:string){
    return this.http.delete("https://mynestonline.com/collection/api/delete-gallery-image?vendorId="+vendorId+"&imageName="+imageName);
  }
  sendEmailOtp(email:string){
    return this.http.post("https://mynestonline.com/collection/api/otp/register/email-otp?email="+email+"&role=ROLE_VENDOR",null);
  }
  sendMobileOtp(mobile:string){
    return this.http.post("https://mynestonline.com/collection/api/otp/register/sms-otp?mobile="+mobile+"&role=ROLE_VENDOR",null);
  }
  verifyOtp(otp:string){
    return this.http.get("https://mynestonline.com/collection/api/otp/verify-otp?otp="+otp);
  }
  forgotPasswordOfVendor(email:string,role:string):Observable<any>{
    return this.http.post("https://mynestonline.com/collection/api/forgot-pass?role="+role+"&email="+email,null);
  }
  sendOtpForLogin(mobile:string,role:string):Observable<any>{
    return this.http.post("https://mynestonline.com/collection/api/otp/login/sms-otp?mobile="+mobile+"&role="+role,null);
  }
  verifyOtpForLogin(paramData:any){
    return this.http.post("https://mynestonline.com/collection/api/otp/verify-login",paramData);
  }
  
} 
