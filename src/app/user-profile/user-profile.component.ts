import { Component, OnInit } from '@angular/core';
import { UserApp } from '../models/main-user';
import { AuthService } from '../auth/auth.service';
import { UserProfileService } from './user-profile.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Md5 } from 'ts-md5';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  public user: UserApp = null;
  public form: FormGroup;

  constructor(
    private userService: UserProfileService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private routeur: Router
  ) { }

  ngOnInit() {
    this.userService.getUserInfo().subscribe((user: UserApp) => {
      this.user = UserApp.FROM_JSON(user);
      this.form = this.fb.group({
        firstName: [this.user.$firstName, Validators.required],
        lastName: [this.user.$lastName, Validators.required],
        username: [this.user.$username, Validators.required],
        email: [this.user.$email, Validators.compose([Validators.required, Validators.email])],
        password: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(40)])],
        accountNonExpired: [true, Validators.required],
        accountNonLocked: [true, Validators.required],
        credentialsNonExpired: [true, Validators.required],
        enabled: [true, Validators.required]
      });
    });
  }

  getGravatarUrl(): string {
    return 'https://www.gravatar.com/avatar/' + Md5.hashStr(this.user.$email);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.userService.updateUser(this.form.value).subscribe(d => {
        this.openSnackBar('Success');
        this.routeur.navigateByUrl('/');
      }, (err) => {
        console.log(err);
      });
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 10000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }

}
