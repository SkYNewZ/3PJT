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

  public filesExamples: File[] = [
    {
      name: 'file 1',
      uuid: 'e9d43a5a-c6e1-4c18-891f-9eefa5c84c08',
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      name: 'file 2',
      uuid: 'e9d43a5a-c6e1-4c18-891f-9eefa5c84c08',
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      name: 'file 3',
      uuid: 'e9d43a5a-c6e1-4c18-891f-9eefa5c84c08',
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      name: 'file 4',
      uuid: 'e9d43a5a-c6e1-4c18-891f-9eefa5c84c08',
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      name: 'file 5',
      uuid: 'e9d43a5a-c6e1-4c18-891f-9eefa5c84c08',
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      name: 'file 6',
      uuid: 'e9d43a5a-c6e1-4c18-891f-9eefa5c84c08',
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      name: 'file 7',
      uuid: 'e9d43a5a-c6e1-4c18-891f-9eefa5c84c08',
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      name: 'file 8',
      uuid: 'e9d43a5a-c6e1-4c18-891f-9eefa5c84c08',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ];

  constructor(
    private http: HttpClient
  ) { }

  // getFiles(): Observable<File[]> {
  //   return this.http.get<File[]>(environment.apiEndoint + '/files');
  // }

  getOneFile(id: string): Observable<File> {
    return this.http.get<File>(environment.apiEndoint + `/files/${id}`);
  }

  // TODO: get the correct files
  getFiles(): Observable<File[]> {
    return Observable.of(this.filesExamples);
  }
}
