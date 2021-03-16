import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdvertiseComponent } from './components/advertise/advertise.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { MyAdvertisementsComponent } from './components/my-advertisements/my-advertisements.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { PackagesComponent } from './components/packages/packages.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { ProfileStepperComponent } from './components/profile-stepper/profile-stepper.component';
import { RequirementsComponent } from './components/requirements/requirements.component';
import { SelectPackageComponent } from './components/select-package/select-package.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { PackageGuard } from './guards/package.guard';
import { ProfileGuard } from './guards/profile.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent,canActivate:[AuthGuard]},
  { path: 'packages', component: PackagesComponent,canActivate:[AuthGuard]},
  { path: 'advertise', component: AdvertiseComponent,canActivate:[AuthGuard]},
  { path: 'my-advertisements', component: MyAdvertisementsComponent,canActivate:[AuthGuard]},
  { path: 'requirements', component: RequirementsComponent,canActivate:[AuthGuard]},
  { path: 'notifications', component: NotificationsComponent,canActivate:[AuthGuard]},
  { path: 'signup', component: SignupComponent,canActivate:[LoginGuard]},
  { path: 'profile-settings', component: ProfileSettingsComponent,canActivate:[AuthGuard]},
  { path: 'select-package', component: SelectPackageComponent,canActivate:[PackageGuard]},
  { path: 'profile', component: ProfileStepperComponent,canActivate:[ProfileGuard]},
  { path: 'login', component: LoginComponent,canActivate:[LoginGuard] },
  { path: '**', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
