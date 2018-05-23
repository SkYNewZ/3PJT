import { Injectable, Output, EventEmitter } from '@angular/core';
import { File } from './file/file';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  @Output() fire: EventEmitter<File> = new EventEmitter();

  constructor() {
    console.log('shared service started');
  }

  newUploadedFile(file: File): void {
    this.fire.emit(file);
  }

  getLastFileUploaded() {
    return this.fire;
  }
}
