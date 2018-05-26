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
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((user: UserApp) => {
      if (!user.$email) {
        this.isLoggedIn = false;
      } else {
        this.isLoggedIn = true;
        this.user = user;
      }
    });
  }

  onLogout() {
    this.isLoggedIn = false;
    this.authService.logout();
  }

  getFormatedFirstnameAndLastname(): string {
    return (
      this.user.$firstName.charAt(0).toUpperCase() +
      this.user.$firstName.substr(1).toLowerCase() +
      ' ' +
      this.user.$lastName.charAt(0).toUpperCase() +
      this.user.$lastName.substr(1).toLowerCase()
    );
  }
}
