import { Component, OnInit } from '@angular/core';
import { User } from '../auth/user';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { UserApp } from '../models/main-user';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public user: UserApp;
  isLoggedIn: Boolean = false;
  gravatarUrl: string | Int32Array;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((user: UserApp) => {
      if (!user.$email) {
        this.isLoggedIn = false;
      } else {
        this.isLoggedIn = true;
        this.user = user;
        this.getGravatarUrl();
      }
    });
  }

  onLogout() {
    this.isLoggedIn = false;
    this.authService.logout();
  }

  getGravatarUrl(): void {
    this.gravatarUrl = 'https://www.gravatar.com/avatar/' + Md5.hashStr(this.user.$email);
  }
}
