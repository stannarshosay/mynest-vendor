//flexlayout module
import { FlexLayoutModule } from '@angular/flex-layout';

//Material modules
import {MatRippleModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressBarModule} from '@angular/material/progress-bar';

//common
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AsideComponent } from './components/aside/aside.component';
import { PackagesComponent } from './components/packages/packages.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SelectPackageComponent } from './components/select-package/select-package.component';
import { ProfileStepperComponent } from './components/profile-stepper/profile-stepper.component';
import { AgmCoreModule } from '@agm/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {NgxPaginationModule} from 'ngx-pagination';
import { RequirementsComponent } from './components/requirements/requirements.component';
import { SendQouteComponent } from './dialogs/send-qoute/send-qoute.component';
import { ReportRequirementComponent } from './dialogs/report-requirement/report-requirement.component';
import { VerifyEmailComponent } from './dialogs/verify-email/verify-email.component';
import { VerifyMobileComponent } from './dialogs/verify-mobile/verify-mobile.component';
import { FormatTimePipe } from './pipes/format-time.pipe';
import { AdvertiseComponent } from './components/advertise/advertise.component';
import { MyAdvertisementsComponent } from './components/my-advertisements/my-advertisements.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ForgotPasswordComponent } from './dialogs/forgot-password/forgot-password.component';
import { LoginOtpComponent } from './dialogs/login-otp/login-otp.component';
import { GetAdLinkComponent } from './dialogs/get-ad-link/get-ad-link.component';
import { RefferalCodeComponent } from './dialogs/refferal-code/refferal-code.component';
import { RequestAgentRemovalComponent } from './dialogs/request-agent-removal/request-agent-removal.component';
import { FaqComponent } from './components/faq/faq.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    AsideComponent,
    PackagesComponent,
    SignupComponent,
    ProfileSettingsComponent,
    LoginComponent,
    SelectPackageComponent,
    ProfileStepperComponent,
    RequirementsComponent,
    SendQouteComponent,
    ReportRequirementComponent,
    VerifyEmailComponent,
    VerifyMobileComponent,
    FormatTimePipe,
    AdvertiseComponent,
    MyAdvertisementsComponent,
    NotificationsComponent,
    ForgotPasswordComponent,
    LoginOtpComponent,
    GetAdLinkComponent,
    RefferalCodeComponent,
    RequestAgentRemovalComponent,
    FaqComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCVBIT48KOxSsZLiRseEhGYlbB3DUw0NX4'
      /* apiKey is required, unless you are a
      premium customer, in which case you can
      use clientId
      */
    }),
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatRippleModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatDialogModule,
    MatStepperModule,
    MatIconModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    CarouselModule,
    MatTabsModule,
    MatTooltipModule,
    MatExpansionModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
