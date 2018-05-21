import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { File } from './file';
import 'rxjs/add/observable/of';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private http: HttpClient
  ) { }

  getOneFile(id: string): Observable<File> {
    return this.http.get<File>(environment.apiEndoint + `/files/${id}`);
  }

  getFiles(folder?: string): Observable<File[]> {
    if (!folder) {
      return this.http.get<File[]>(environment.apiEndoint + environment.listFilesEndpoint);
    } else {
      return this.http.get<File[]>(`${environment.apiEndoint + environment.listFilesEndpoint}?folder=${folder}`);
    }
  }
}
