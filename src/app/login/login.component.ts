import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from './../auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../models/api-error';
import { plainToClass } from 'class-transformer';
import { LoginSuccess } from '../models/login-success';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  private formSubmitAttempt: boolean;
  private registerFormSubmitAttempt: boolean;
  public registerForm: FormGroup;
  public selectedTab = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(40)])]
    });
  }

  isFieldInvalid(field: string, form: FormGroup): boolean {
    return (
      (!form.get(field).valid && form.get(field).touched) ||
      (form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  isInvalidPassword(): boolean {
    return (
      (!this.registerForm.get('password').valid && this.registerForm.get('password').touched) ||
      (this.registerForm.get('password').untouched && this.registerFormSubmitAttempt)
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.login(this.form.value);
    }
    this.formSubmitAttempt = true;
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe((login) => {
        this.selectedTab = 0;
        this.form.get('userName').patchValue(this.registerForm.get('username').value);
        this.registerForm.reset();
        this.openSnackBar('Registration successfully');
      }, (err: any) => {
        const e = plainToClass(LoginSuccess, err.error);
        if (e instanceof LoginSuccess) {
          this.registerForm.get('password').reset();
          if (e.message.includes('mail')) {
            this.registerForm.get('email').reset();
          }
          if (e.message.includes('Username')) {
            this.registerForm.get('username').reset();
          }
          this.openSnackBar(e.message);
        } else {
          console.log(e);
        }
      });
    }
    this.registerFormSubmitAttempt = true;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 10000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}
