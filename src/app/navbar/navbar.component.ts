import { Component, OnInit } from '@angular/core';
import { User } from '../auth/user';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { UserApp } from '../models/main-user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: User;
  isLoggedIn: Boolean = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((user: UserApp) => {
      if (!user.$email) {
        this.isLoggedIn = false;
      } else {
        this.isLoggedIn = true;
      }
    });
  }

  onLogout() {
    this.isLoggedIn = false;
    this.authService.logout();
  }
}
