import { Injectable, Output, EventEmitter } from '@angular/core';
import { File } from './file/file';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  @Output() fire: EventEmitter<File> = new EventEmitter();

  constructor() {
  }

  newUploadedFile(file: File): void {
    this.fire.emit(file);
  }

  getLastFileUploaded() {
    return this.fire;
  }
}
