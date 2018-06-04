import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserApp } from '../models/main-user';
import { AuthService } from '../auth/auth.service';
import { UserProfileService } from './user-profile.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Md5 } from 'ts-md5';
import { Router } from '@angular/router';
import { Offer } from '../models/offer';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  public user: UserApp = null;
  public form: FormGroup;
  public showLoader: Boolean = true;
  private formSubmitAttempt: boolean;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private routeur: Router,
    private authService: AuthService,
    private userService: UserProfileService
  ) { }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((user: UserApp) => {
      this.user = user;
      this.form = this.fb.group({
        firstname: [this.user.firstname, Validators.required],
        lastname: [this.user.lastname, Validators.required],
        // username: [this.user.username, Validators.required],
        email: [this.user.email, Validators.compose([Validators.required, Validators.email])],
        password: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(40)])],
      });
      this.showLoader = false;
    });
  }

  ngOnDestroy(): void {
    this.toastr.clear();
  }

  onSubmit(): void {
    this.formSubmitAttempt = true;
    if (this.form.valid) {
      this.userService.updateUser(this.form.value).subscribe((user: UserApp) => {
        const newUser: UserApp = UserApp.FROM_JSON(user);
        this.authService.login(newUser);
        this.toastr.success('Success');
        this.form.get('password').reset();
        this.formSubmitAttempt = false;
      }, (err) => {
        console.log(err);
      });
    }
  }

  manageOffer(event: MouseEvent): void {
    event.preventDefault();
    console.log('TODO, mange offer');
  }

  public get quota(): number {
    const maxSizeAvailable: number = this.user.offre.maxSize;
    const currentSizeUsed: number = this.user.currentDataSize;
    const percentage: number = ((currentSizeUsed * 100) / maxSizeAvailable);
    return Math.round(percentage);
  }

  public get formatedQuota(): string {
    const offer: Offer = Offer.FROM_JSON(this.user.offre);
    return `${this.quota}% - ${this.user.currentDataSizeInGB.toFixed(2)}GB/${offer.maxSizeInGB.toFixed(2)}GB`;
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

  isFieldInvalid(field: string): boolean {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

}
