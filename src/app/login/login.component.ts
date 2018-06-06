import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';
import { AuthService } from './../auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../models/api-error';
import { plainToClass } from 'class-transformer';
import { LoginSuccess } from '../models/login-success';
import { JwtApp } from '../models/jwt';
import { UserProfileService } from '../user-profile/user-profile.service';
import { UserApp } from '../models/main-user';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Location } from '@angular/common';
import { SocialUser } from 'angularx-social-login';
import { AuthService as SocialAuthService } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  private formSubmitAttempt: boolean;
  private registerFormSubmitAttempt: boolean;
  public registerForm: FormGroup;
  public selectedTab = 0;
  public returnUrl: string;
  public showLoader: Boolean = false;
  public submitButtonLabel: String = 'Submit';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private router: Router,
    private jwtService: JwtHelperService,
    private route: ActivatedRoute,
    private location: Location,
    private socialLoginService: SocialAuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['redirect_uri'] || '/my-files';
    this.form = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20)
        ])
      ]
    });
  }

  ngOnDestroy(): void {
    this.toastr.clear();
  }

  isFieldInvalid(field: string, form: FormGroup): boolean {
    return (
      (!form.get(field).valid && form.get(field).touched) ||
      (form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  isInvalidPassword(): boolean {
    return (
      (!this.registerForm.get('password').valid &&
        this.registerForm.get('password').touched) ||
      (this.registerForm.get('password').untouched &&
        this.registerFormSubmitAttempt)
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.showLoader = true;
      this.submitButtonLabel = 'Logging in...';
      // get token and create BehaviorSubject
      this.authService.getToken(this.form.value).subscribe(
        (jwt: JwtApp) => {
          localStorage.setItem('access_token', jwt.accessToken);
          // get user info, token will be add by @auth0/angular-jwt
          this.userProfileService.getUserInfo().subscribe((user: UserApp) => {
            const u: UserApp = UserApp.FROM_JSON(user);
            this.authService.login(u);
            this.location.replaceState('/');
            this.router.navigateByUrl(this.returnUrl);
          });
        },
        err => {
          console.log(err);
          this.showLoader = false;
          this.submitButtonLabel = 'Submit';
          if (err instanceof HttpErrorResponse && err.status === 401) {
            this.toastr.warning('Incorrect username or password');
            this.form.reset();
          } else if (err instanceof HttpErrorResponse && err.status === 0) {
            this.toastr.error('Server unreachable, please try again later');
          }
        }
      );
    }
    this.formSubmitAttempt = true;
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.showLoader = true;
      this.submitButtonLabel = 'Please wait...';
      this.authService.register(this.registerForm.value).subscribe(
        login => {
          this.selectedTab = 0;
          this.form
            .get('usernameOrEmail')
            .patchValue(this.registerForm.get('username').value);
          this.registerForm.reset();
          this.toastr.success('Registration successfully');
          this.showLoader = false;
          this.submitButtonLabel = 'Submit';
        },
        (err: any) => {
          this.showLoader = false;
          this.submitButtonLabel = 'Submit';
          const e = plainToClass(LoginSuccess, err.error);
          if (e instanceof LoginSuccess) {
            this.registerForm.get('password').reset();
            if (e.message.includes('mail')) {
              this.registerForm.get('email').reset();
              this.toastr.warning(e.message);
            }
            if (e.message.includes('Username')) {
              this.registerForm.get('username').reset();
              this.toastr.warning(e.message);
            }
            if (e.message === 'User Role not set.') {
              this.toastr.error('Unexpected error, please try again later');
              console.log(e);
            }
          } else {
            this.toastr.error('Unexpected error, please try again later');
            console.log(e);
          }
        }
      );
    }
    this.registerFormSubmitAttempt = true;
  }

  signInWithGoogle(): void {
    this.showLoader = true;
    this.authService.signInWithGoogle(this.returnUrl);
  }

  signInWithFB(): void {
    this.showLoader = true;
    this.authService.signInWithFB(this.returnUrl);
  }
}
