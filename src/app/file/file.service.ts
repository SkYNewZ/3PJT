import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { File } from './file';
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

  getSharedFilesAndFolders(uuid?: string): Observable<ApiListElement> {
    if (!uuid) {
      return this.http.get<ApiListElement>(environment.apiEndoint + environment.listSharedEntitiesEndpoint);
    } else {
      return this.http.get<ApiListElement>(`${environment.apiEndoint + environment.listFilesAndFolderInSharedFolderEndpoint}/${uuid}`);
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

  downloadFile(entity: File): Observable<Blob> {
    return this.http.get(`${environment.apiEndoint + environment.downloadFileEndpoint}/${entity.uuid}`, {
      responseType: 'blob'
    }).map((blob: Blob) => {
      return new Blob([blob], { type: entity.mimeType });
    });
  }

  downloadSharedFile(entity: File): Observable<Blob> {
    return this.http.get(`${environment.apiEndoint + environment.downloadSharedFileEndpoint}/${entity.uuid}`, {
      responseType: 'blob'
    }).map((blob: Blob) => {
      return new Blob([blob], { type: entity.mimeType });
    });
  }

  search(query: string): Observable<(File | Folder)[]> {
    return this.http.get<any>(environment.getSearchUrl(query));
  }

  shareOrUnshareEntity(entity: File | Folder): Observable<(File | Folder)> {
    const body: { shared: boolean } = {
      shared: !entity.shared
    };
    if (entity.mimeType === 'inode/directory') {
      return this.http.put<File | Folder>(`${environment.apiEndoint + environment.shareFolderEndpoint}/${entity.uuid}`, body);
    } else {
      return this.http.put<File | Folder>(`${environment.apiEndoint + environment.shareFileEndpoint}/${entity.uuid}`, body);
    }
  }

  streamImage(entity: File): Observable<Blob> {
    if (entity.mimeType.includes('video') || entity.mimeType.includes('image')) {
      return this.http.get(`${environment.apiEndoint + environment.downloadFileEndpoint}/${entity.uuid}`, {
        responseType: 'blob'
      });
    }
  }

  streamSharedImage(entity: File): Observable<Blob> {
    if (entity.mimeType.includes('video') || entity.mimeType.includes('image')) {
      return this.http.get(`${environment.apiEndoint + environment.downloadSharedFileEndpoint}/${entity.uuid}`, {
        responseType: 'blob'
      });
    }
  }

  moveEntity(entity: File | Folder, direction: Folder): Observable<File | Folder> {
    const body: {uuid: string} = {
      uuid: direction.uuid
    };
    if (entity.mimeType === 'inode/directory') {
      return this.http.put<File | Folder>(`${environment.apiEndoint + environment.moveFolderEndpoint}/${entity.uuid}`, body);
    } else {
      return this.http.put<File | Folder>(`${environment.apiEndoint + environment.moveFileEndpoint}/${entity.uuid}`, body);
    }
  }

  moveBackEntity(entity: File | Folder): Observable<File | Folder> {
    if (entity.mimeType === 'inode/directory') {
      return this.http.put<File | Folder>(`${environment.apiEndoint + environment.moveBackFolderEndpoint}/${entity.uuid}`, entity);
    } else {
      return this.http.put<File | Folder>(`${environment.apiEndoint + environment.moveBackFileEndpoint}/${entity.uuid}`, entity);
    }
  }
}
