import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SharedService } from '../shared.service';
import { File as ApiFile } from '../file/file';
import { ApiError } from '../models/api-error';

@Injectable()
export class UploadService {
  constructor(private http: HttpClient, private ss: SharedService) { }

  // upload a set of file
  public upload(
    files: Set<File>,
    currentDirectoryUuid?: string
  ): { [key: string]: Observable<number> } {
    // this will be the our resulting map
    const status = {};
    let url: string = environment.apiEndoint + environment.uploadFileEndpoint;
    if (currentDirectoryUuid) {
      url += `/${currentDirectoryUuid}`;
    }

    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest(
        'POST',
        url,
        formData,
        {
          reportProgress: true
        }
      );

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          // calculate the progress percentage
          const percentDone = Math.round(100 * event.loaded / event.total);

          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          // communicate the result file for displaying in the list
          const f: ApiFile = ApiFile.FROM_JSON(event.body);
          this.ss.newUploadedFile(f);
          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          progress.complete();
        }
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          const apiError: ApiError = ApiError.FROM_JSON(err.error);
          console.error(`Error during upload file in upload.service.ts - ${apiError.status} - ${apiError.message}`);
        } else {
          console.error(err);
        }
      });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    });

    // return the map of progress.observables
    return status;
  }

  // upload a single file
  public simpleUpload(file: File, currentDirectoryUuid?: string): Observable<ApiFile> {
    let url: string = environment.apiEndoint + environment.uploadFileEndpoint;
    if (currentDirectoryUuid) {
      url += `/${currentDirectoryUuid}`;
    }
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<ApiFile>(url, formData);
  }
}
