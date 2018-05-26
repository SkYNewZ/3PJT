import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from './user';
import { LoginUser } from '../models/login-user';
import { Observable } from 'rxjs';
import { LoginSuccess } from '../models/login-success';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserApp } from '../models/main-user';
import { JwtApp } from '../models/jwt';
import { AuthService as SocialAuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: BehaviorSubject<UserApp> = new BehaviorSubject<UserApp>(new UserApp());

  constructor(
    private router: Router,
    private http: HttpClient,
    private socialAuthService: SocialAuthService,
    private location: Location
  ) { }

  public get isLoggedIn(): Observable<UserApp> {
    return this.user.asObservable();
  }

  login(user: UserApp) {
    const userapp: UserApp = UserApp.FROM_JSON(user);
    userapp.$photoUrl = userapp.getGravatarUrl();
    this.user.next(userapp);
  }

  getToken(user: User): Observable<JwtApp> {
    return this.http.post<JwtApp>(environment.apiEndoint + environment.signinEndpoint, user);
  }

  logout() {
    this.user.next(new UserApp());
    localStorage.removeItem('access_token');
    this.router.navigateByUrl('/login');
    // this.socialAuthService.signOut(); REMOVED 26/05/2018, it disconnect from the social network
  }

  register(user: LoginUser): Observable<LoginSuccess> {
    return this.http.post<LoginSuccess>(environment.apiEndoint + environment.signupEndpoint, user);
  }

  checkUsernameAvailability(username: string): Observable<Boolean> {
    return this.http.get<Boolean>(`${environment.apiEndoint + environment.checkUsernameAvailabilityEndpoint}?username=${username}`);
  }

  signInWithGoogle(returnUrl?: string): void {
    // get google info
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((googleUser: SocialUser) => {
      // get api token
      const body: { accessToken: string } = {
        accessToken: googleUser.authToken
      };
      this.http.post<{ accessToken: string }>(environment.getSocialSignInEndpoint('google'), body).subscribe((jwt: JwtApp) => {
        localStorage.setItem('access_token', jwt.accessToken);
        const user: UserApp = new UserApp();
        user.$firstName = googleUser.name.split(' ')[0];
        user.$lastName = googleUser.name.split(' ')[1];
        user.$email = googleUser.email;
        user.$photoUrl = googleUser.photoUrl;
        user.$provider = 'google';
        this.user.next(user);
        this.location.replaceState('/');
        this.router.navigateByUrl(returnUrl);
        console.log(user);
      });
    });
  }

  signInWithFB(returnUrl?: string): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((facebookUser: SocialUser) => {
      // get api token
      const body: { accessToken: string } = {
        accessToken: facebookUser.authToken
      };
      this.http.post<{ accessToken: string }>(environment.getSocialSignInEndpoint('facebook'), body).subscribe((jwt: JwtApp) => {
        localStorage.setItem('access_token', jwt.accessToken);
        const user: UserApp = new UserApp();
        user.$firstName = facebookUser.firstName;
        user.$lastName = facebookUser.lastName;
        user.$email = facebookUser.email;
        user.$photoUrl = facebookUser.photoUrl;
        user.$provider = 'facebook';
        this.user.next(user);
        this.location.replaceState('/');
        this.router.navigateByUrl(returnUrl);
        console.log(user);
      });
    });
  }

  // socialLoginSubscription(social: SocialUser, returnUrl?: string): void {
  //   console.log(social);
  //   if (social) {
  //     const body: { accessToken: string } = {
  //       accessToken: social.authToken
  //     };
  //     this.http.post<{ accessToken: string }>(environment.getSocialSignInEndpoint(social.provider.toLowerCase()), body).subscribe((jwt: JwtApp) => {
  //       localStorage.setItem('access_token', jwt.accessToken);
  //       const user: UserApp = new UserApp();
  //       user.$firstName = social.firstName;
  //       user.$lastName = social.lastName;
  //       user.$email = social.email;
  //       user.$photoUrl = social.photoUrl;
  //       user.$provider = 'facebook';
  //       this.user.next(user);
  //       this.location.replaceState('/');
  //       this.router.navigateByUrl(returnUrl);
  //       console.log(user);
  //     });
  //   }
  // }
}
