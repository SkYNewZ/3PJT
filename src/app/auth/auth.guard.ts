import { Injectable } from '@angular/core';
import {
  CanActivate,
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

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private jwtService: JwtHelperService
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isLoggedIn.take(1).map((user: UserApp) => {
      const token: string = localStorage.getItem('access_token');
      if (this.jwtService.isTokenExpired(token)) {
        this.router.navigate(['login'], { queryParams: { redirect_uri: state.url } });
        return false;
      } else if (!user.$email) {
        this.router.navigate(['login'], { queryParams: { redirect_uri: state.url } });
        return false;
      } else {
        return true;
      }
    });
  }
}
