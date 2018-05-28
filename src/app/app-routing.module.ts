import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { FileComponent } from './file/file.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  { path: 'my-files', component: FileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/my-files',
    pathMatch: 'full'
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
