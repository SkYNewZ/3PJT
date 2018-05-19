import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserApp } from '../models/main-user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(
    private http: HttpClient
  ) { }

  getUserInfo(): Observable<UserApp> {
    return this.http.get<UserApp>(environment.apiEndoint + environment.userInfoEndpoint);
  }
}
