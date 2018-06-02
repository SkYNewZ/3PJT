import { Component, OnInit } from '@angular/core';
import { User } from '../auth/user';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { UserApp } from '../models/main-user';
import { Md5 } from 'ts-md5';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FileService } from '../file/file.service';
import { Folder } from '../file/folder';
import { File } from '../file/file';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public user: UserApp;
  isLoggedIn: Boolean = false;
  public searchControl: FormGroup;
  public isItDeployedInProduction: boolean;
  public options: (File | Folder)[];
  public searching: Boolean = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private fileService: FileService
  ) {
    this.searchControl = this.formBuilder.group({
      input: ''
    });
    this.isItDeployedInProduction = !environment.production;
  }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((user: UserApp) => {
      if (!user.email) {
        this.isLoggedIn = false;
      } else {
        this.isLoggedIn = true;
        this.user = user;
      }
    });
  }

  onLogout() {
    this.isLoggedIn = false;
    this.authService.logout();
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

  /**
   * Display the file view with search results
   */
  submitSearch(): void {
    this.searching = true;
    this.fileService.search(this.searchControl.get('input').value).subscribe((entities: (File | Folder)[]) => {
      this.searching = false;
      // TODO: refacto file listing as a component in order to used it here
    }, (err) => {
      console.log(err);
      this.searching = false;
    });
  }

  /**
   * Used for the autocomplete, display direct links and icons on each seach result
   * @param currentSearch
   */
  onType(currentSearch: string): void {
    if (currentSearch.length > 3) {
      this.searching = true;
      this.fileService.search(this.searchControl.get('input').value).subscribe((entities: (File | Folder)[]) => {
        this.searching = false;
        this.options = entities;
      }, (err) => {
        console.log(err);
        this.searching = false;
      });
    }
  }
}
