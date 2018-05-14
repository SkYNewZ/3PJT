import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { File } from './file';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private http: HttpClient
  ) { }

  getFiles(): Observable<File[]> {
    return this.http.get<File[]>(environment.apiEndoint + '/files');
  }

  getOneFile(id: string): Observable<File> {
    return this.http.get<File>(environment.apiEndoint + `/files/${id}`);
  }
}
