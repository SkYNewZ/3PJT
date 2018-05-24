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
  constructor(private http: HttpClient) { }

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

  renameFile(entity: File | Folder, newName: string): Observable<File | Folder> {
    const body: { name: string } = {
      name: newName
    };
    if (entity.mimeType === 'inode/directory') {
      return this.http.put<Folder>(`${environment.apiEndoint + environment.renameFolderEndpoint}/${entity.uuid}`, body);
    } else {
      return this.http.put<File>(`${environment.apiEndoint + environment.renameFileEndpoint}/${entity.uuid}`, body);
    }
  }

  deleteFileOrFolder(entity: File | Folder): Observable<File | Folder> {
    if (entity.mimeType === 'inode/directory') {
      return this.http.delete<Folder>(`${environment.apiEndoint + environment.deleteFolderEndpoint}/${entity.uuid}`);
    } else {
      return this.http.delete<File>(`${environment.apiEndoint + environment.deleteFileEndpoint}/${entity.uuid}`);
    }
  }
}
