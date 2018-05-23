import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { File } from './file';
import 'rxjs/add/observable/of';
import { ApiListElement } from './list-element';
import { Folder } from './folder';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private http: HttpClient) {}

  // get a list of file from the given (optionnal) directory
  getFiles(uuid?: string): Observable<ApiListElement> {
    const url: string = environment.apiEndoint + environment.listFilesEndpoint;
    if (!uuid) {
      return this.http.get<ApiListElement>(url);
    } else {
      return this.http.get<ApiListElement>(url + `/${uuid}`);
    }
  }

  createFolder(
    folderNameToCreate: string,
    parentUuid?: string
  ): Observable<Folder> {
    const body: { name: string } = {
      name: folderNameToCreate
    };
    const url = `${environment.apiEndoint + environment.createFolderEndpoint}`;
    if (!parentUuid) {
      return this.http.post<Folder>(url, body);
    } else {
      return this.http.post<Folder>(url + `/${parentUuid}`, body);
    }
  }
}
