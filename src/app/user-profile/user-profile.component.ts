import { Component, OnInit } from '@angular/core';
import { SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: SocialUser;

  constructor() {
    if (localStorage.getItem('loggedIn') === 'true') {
      this.user = new SocialUser();
      this.user.email = localStorage.getItem('user_email');
      this.user.photoUrl = localStorage.getItem('user_avatar');
      this.user.firstName = localStorage.getItem('user_firstname');
      this.user.lastName = localStorage.getItem('user_lastname');
    }
  }

  ngOnInit() {
  }

}
