import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from './user';
import { LoginUser } from '../models/login-user';
import { Observable } from 'rxjs';
import { LoginSuccess } from '../models/login-success';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  login(user: User) {
    if (user.userName !== '' && user.password !== '') {
      this.loggedIn.next(true);
      this.router.navigateByUrl('/');
    }
  }

  logout() {
    this.loggedIn.next(false);
    this.router.navigateByUrl('/login');
  }

  register(user: LoginUser): Observable<LoginSuccess> {
    return this.http.post<LoginSuccess>(environment.apiEndoint + environment.signupEndpoint, user);
  }

  checkUsernameAvailability(username: string): Observable<Boolean> {
    return this.http.get<Boolean>(`${environment.apiEndoint + environment.checkUsernameAvailabilityEndpoint}?username=${username}`);
  }
}
