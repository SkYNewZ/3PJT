import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { File } from './file';
import 'rxjs/add/observable/of';
import { ApiListElement } from './list-element';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private http: HttpClient
  ) { }

  // get one file (in order to diplay it)
  // TODO: is it usefull ?
  getOneFile(uuid: string): Observable<File> {
    return this.http.get<File>(environment.apiEndoint + `/files/${uuid}`);
  }

  // get a list of file from the given (optionnal) directory
  getFiles(uuid?: string): Observable<ApiListElement> {
    const url: string = environment.apiEndoint + environment.listFilesEndpoint;
    if (!uuid) {
      return this.http.get<ApiListElement>(url);
    } else {
      return this.http.get<ApiListElement>(url + `/${uuid}`);
    }
  }
}
