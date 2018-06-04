import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { FileDropModule } from 'ngx-file-drop';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material/material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from './/app-routing.module';
import { FileComponent } from './file/file.component';
import { HttpClientModule } from '@angular/common/http';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UploadModule } from './upload/upload.module';
import { InputDialogComponent } from './file/input-dialog/input-dialog.component';
import { ConfirmationDialogComponent } from './file/confirmation-dialog/confirmation-dialog.component';
import { SharingComponent } from './sharing/sharing.component';
import { ImageComponent } from './file/streaming/image/image.component';

export function provideConfig() {
  return new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider('877043710493-23ri0aj7bu47l9esjnjs23oqe88ibc4k.apps.googleusercontent.com')
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider('172124940168150')
    }
  ]);
}

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    FileComponent,
    UserProfileComponent,
    InputDialogComponent,
    ConfirmationDialogComponent,
    SharingComponent,
    ImageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SocialLoginModule,
    FlexLayoutModule,
    MaterialModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:8080', 'supdrive.lemairepro.fr'],
        blacklistedRoutes: [
          'localhost:8080/api/auth',
          'supdrive.lemairepro.fr/api/auth',
          'localhost:8080/api/share',
          'supdrive.lemairepro.fr/api/share'
        ]
      }
    }),
    UploadModule,
    FileDropModule,
    ToastrModule.forRoot({
      autoDismiss: true,
      progressBar: true,
      progressAnimation: 'decreasing'
    })
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  entryComponents: [InputDialogComponent, ConfirmationDialogComponent, ImageComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
