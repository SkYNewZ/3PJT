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
  public showLoader: Boolean = true;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private routeur: Router,
    private authService: AuthService,
    private userService: UserProfileService
  ) { }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((user: UserApp) => {
      this.user = user;
      this.form = this.fb.group({
        firstName: [this.user.firstname, Validators.required],
        lastName: [this.user.lastname, Validators.required],
        username: [this.user.username, Validators.required],
        email: [this.user.email, Validators.compose([Validators.required, Validators.email])],
        password: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(40)])],
        accountNonExpired: [true, Validators.required],
        accountNonLocked: [true, Validators.required],
        credentialsNonExpired: [true, Validators.required],
        provider: ['supdrive', Validators.required],
        enabled: [true, Validators.required]
      });
      this.showLoader = false;
    });
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

  manageOffer(event: MouseEvent): void {
    event.preventDefault();
    console.log('TODO, mange offer');
  }

  public get quota(): number {
    const maxSizeAvailable: number = this.user.offre.maxSize;
    const currentSizeUsed: number = this.user.currentDataSize;
    const percentage: number = ((currentSizeUsed * maxSizeAvailable) / 100);
    return Math.floor(percentage);
  }

  public get formatedFirstnameAndLastname(): string {
    return (
      this.user.firstname.charAt(0).toUpperCase() +
      this.user.firstname.substr(1).toLowerCase() +
      ' ' +
      this.user.lastname.charAt(0).toUpperCase() +
      this.user.lastname.substr(1).toLowerCase()
    );
  }

}
