import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {}

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
}
