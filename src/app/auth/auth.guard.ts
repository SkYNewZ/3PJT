import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { UserApp } from '../models/main-user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router,
    private jwtService: JwtHelperService,
    private snackBar: MatSnackBar
  ) { }

  // common auth
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.jwtService.tokenGetter()) {
      // if token does not exist
      console.log('Token not exist');
      this.logout();
      this.router.navigate(['login'], {
        queryParams: { redirect_uri: state.url }
      });
      return false;
    } else if (this.jwtService.isTokenExpired()) {
      // if token is expired
      console.log('Token is expired');
      this.openSnackBar('Session expired, please login in');
      this.logout();
      this.router.navigate(['login'], {
        queryParams: { redirect_uri: state.url }
      });
      return false;
    } else if (
      Date.now() + 300000 >
      this.jwtService.getTokenExpirationDate().getTime()
    ) {
      // if token will be expired in 5min
      console.log('Token will expire in 5minutes');
      this.openSnackBar('Session expired, please login in');
      this.logout();
      this.router.navigate(['login'], {
        queryParams: { redirect_uri: state.url }
      });
      return false;
    } else {
      this.authService.isLoggedIn.take(1).subscribe((user: UserApp) => {
        if (!user.email) {
          this.logout();
          this.router.navigate(['login'], {
            queryParams: { redirect_uri: state.url }
          });
          return false;
        }
      });
    }
    return true;
  }

  // forbidden for socials users
  canActivateChild(): boolean {
    this.authService.isLoggedIn.take(1).subscribe((user: UserApp) => {
      return user.provider !== 'supdrive' ? false : true;
    });
    return true;
  }

  private logout(): void {
    this.authService.user.next(new UserApp());
    localStorage.removeItem('access_token');
  }
  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 10000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}
