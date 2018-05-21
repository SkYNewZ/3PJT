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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: BehaviorSubject<UserApp> = new BehaviorSubject<UserApp>(new UserApp());

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  public get isLoggedIn(): Observable<UserApp> {
    return this.user.asObservable();
  }

  login(user: UserApp) {
    this.user.next(UserApp.FROM_JSON(user));
  }

  getToken(user: User): Observable<JwtApp> {
    return this.http.post<JwtApp>(environment.apiEndoint + environment.signinEndpoint, user);
  }

  logout() {
    this.user.next(new UserApp());
    localStorage.removeItem('access_token');
    this.router.navigateByUrl('/login');
  }

  register(user: LoginUser): Observable<LoginSuccess> {
    return this.http.post<LoginSuccess>(environment.apiEndoint + environment.signupEndpoint, user);
  }

  checkUsernameAvailability(username: string): Observable<Boolean> {
    return this.http.get<Boolean>(`${environment.apiEndoint + environment.checkUsernameAvailabilityEndpoint}?username=${username}`);
  }
}
