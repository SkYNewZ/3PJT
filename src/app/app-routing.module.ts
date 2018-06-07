import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { FileComponent } from './file/file.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SharingComponent } from './sharing/sharing.component';
import { OfferComponent } from './offer/offer.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'my-files', component: FileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  { path: 'offers', component: OfferComponent, canActivate: [AuthGuard] },
  { path: 'public', component: SharingComponent },
  { path: 'public/folder/:uuid', component: SharingComponent },
  {
    path: '', component: HomeComponent
  },
  { path: 'folder/:uuid', component: FileComponent, canActivate: [AuthGuard] },
  {
    path: '**',
    redirectTo: '/my-files',
    pathMatch: 'full'
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  declarations: []
})
export class AppRoutingModule { }
