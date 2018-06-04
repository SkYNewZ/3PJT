import { Component, OnInit, ViewChild, OnDestroy, Inject } from '@angular/core';
import { FileService } from './file.service';
import { File as ApiFile } from './file';
import { MatTableDataSource, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiListElement } from './list-element';
import { Folder } from './folder';
import { ActivatedRoute, Route, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { SharedService } from '../shared.service';
import { InputDialogComponent } from './input-dialog/input-dialog.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { UploadEvent, FileSystemFileEntry, FileSystemDirectoryEntry, UploadFile } from 'ngx-file-drop';
import { UploadService } from '../upload/upload.service';
import 'rxjs/operator/map';
import { ISubscription } from 'rxjs/Subscription';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../models/api-error';
import { DOCUMENT, DomSanitizer } from '@angular/platform-browser';
import { ImageComponent } from './streaming/image/image.component';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit, OnDestroy {
  public showLoader: Boolean = true;
  public dataSource: MatTableDataSource<ApiFile | Folder> = new MatTableDataSource(
    []
  );
  public displayedColumns: String[] = [
    'name',
    'createdAt',
    'updatedAt',
    'createdBy'
  ];
  public selection: SelectionModel<ApiFile> = new SelectionModel<ApiFile>(
    false,
    null
  );
  public showProgressBar: Boolean = false;
  private newFileSub: ISubscription;
  private uuidSub: ISubscription;

  constructor(
    private fileService: FileService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private ss: SharedService,
    private dialog: MatDialog,
    private uploadService: UploadService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.uuidSub = this.route.params.subscribe(params => {
      this.getFiles(params['uuid']);
    });
    this.newFileSub = this.ss.getLastFileUploaded().subscribe((item: ApiFile) => {
      // push file if a new is upload
      this.dataSource.data.push(item);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.orderDatasource();
    });
  }

  ngOnDestroy(): void {
    this.newFileSub.unsubscribe();
    this.uuidSub.unsubscribe();
  }

  /**
   * Main function to get files from api and display it
   * @param parentFolderUuid
   */
  getFiles(parentFolderUuid?: string): void {
    this.fileService
      .getFiles(parentFolderUuid)
      .subscribe((elements: ApiListElement) => {
        if (!(elements.files.length === 0 && elements.folders.length === 0)) {
          const e: ApiListElement = ApiListElement.FROM_JSON(elements);
          const t: (ApiFile | Folder)[] = [];
          // create the folder array
          let folderTab: Folder[] = [];
          e.folders.forEach((folder, idx) => {
            const fo: Folder = Folder.FROM_JSON(folder);
            folderTab.push(fo);
          });
          // sort
          folderTab = this.sortAlphabetically(folderTab);

          // create the file array
          let filetab: ApiFile[] = [];
          e.files.forEach((file, idx) => {
            const f: ApiFile = ApiFile.FROM_JSON(file);
            filetab.push(f);
          });
          // sort
          filetab = this.sortAlphabetically(filetab);

          // concat the two arrays
          this.dataSource = new MatTableDataSource(
            t.concat(folderTab).concat(filetab)
          );
        } else {
          this.dataSource = new MatTableDataSource([]);
        }
        this.showLoader = false;
      }, (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.openSnackBar('This folder does not exist');
        } else {
          this.openSnackBar('Unexpected error, please try again later');
        }
        console.log(err);
        this.showLoader = false;
      });
  }

  /**
   * Filter function for the mat data table
   */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  /**
   * Delete a file or folder
   * @param entity
   */
  deleteEntity(entity: ApiFile | Folder) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        toDeleteName: entity.name,
        mimeType: entity.mimeType,
        svgIcon: this.getRightIcon(entity.mimeType)
      }
    });

    dialogRef.afterClosed().subscribe(answer => {
      if (answer === true) {
        this.fileService.deleteFileOrFolder(entity).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter(item => item !== entity);
        });
      }
    });
  }

  /**
   * Download a file
   * @param file
   */
  downloadFile(file: ApiFile): void {
    if (file.mimeType !== 'inode/directory') {
      this.showProgressBar = true;
      this.fileService.downloadFile(file).subscribe((blob: Blob) => {
        this.showProgressBar = false;
        const link: HTMLAnchorElement = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = file.name + file.extention;
        link.click();
      });
    }
  }

  /**
   * Rename a file or folder
   * @param entity
   */
  renameEntity(entity: ApiFile | Folder) {
    const dialogRef = this.dialog.open(InputDialogComponent, {
      width: '250px',
      data: {
        title: `Rename ${entity.mimeType === 'inode/directory' ? 'folder' : 'file'}`,
        buttonOkay: 'Rename',
        input: entity.name
      }
    });

    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        this.fileService.renameFile(entity, name).subscribe((renamedEntity: ApiFile) => {
          entity.name = renamedEntity.name;
          entity.updatedAt = renamedEntity.updatedAt;
        });
      }
    });
  }

  /**
   * Send the right svg icon depend of the mimeType of the entity
   * @param mimetype
   */
  getRightIcon(mimetype: string): string {
    if (mimetype.includes('image')) {
      return 'drive_image';
    } else if (mimetype.includes('pdf')) {
      return 'drive_pdf';
    } else if (mimetype.includes('html')) {
      return 'drive_html';
    } else if (mimetype.includes('zip')) {
      return 'drive_zip';
    } else if (mimetype.includes('directory')) {
      return 'folder';
    } else if (mimetype.includes('text')) {
      return 'drive_doc';
    } else if (mimetype.includes('video')) {
      return 'drive_movie';
    } else {
      return 'file_copy';
    }
  }

  /**
   * Sort the mat data table alphabetcally
   * @param tab
   */
  sortAlphabetically(tab: any[]): any[] {
    tab.sort(function (a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });
    return tab;
  }

  /**
   * Return to previous view in the browser history
   */
  backClicked(): void {
    this.location.back();
  }

  /**
   * Navigate to a folder
   * @param row
   */
  navigate(row: ApiFile | Folder): void {
    if (row.mimeType === 'inode/directory') {
      this.router.navigate(['/folder', row.uuid]);
    }
  }

  /**
   * Create a folder
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(InputDialogComponent, {
      width: '250px',
      data: {
        title: 'What will be the name of the folder ?',
        buttonOkay: 'Create'
      }
    });

    // after closing the dialog, send the request for folder creation
    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        this.fileService
          .createFolder(name, this.route.snapshot.paramMap.get('uuid'))
          .subscribe((folder: Folder) => {
            this.dataSource.data.push(folder);
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.orderDatasource();
          });
      }
    });
  }

  /**
   * Order the mat data table to display folder higher to files
   */
  orderDatasource(): void {
    let files: any[] = [];
    let folders: any[] = [];
    const t: (ApiFile | Folder)[] = [];
    this.dataSource.data.forEach((item: ApiFile | Folder) => {
      if (item.mimeType === 'inode/directory') {
        folders.push(item);
      } else {
        files.push(item);
      }
    });
    // sort
    folders = this.sortAlphabetically(folders);
    files = this.sortAlphabetically(files);
    this.dataSource = new MatTableDataSource(t.concat(folders).concat(files));
  }

  /**
   * Share or unshare a file or folder
   * @param entity
   */
  toggleShare(entity: ApiFile | Folder): void {
    this.fileService.shareOrUnshareEntity(entity).subscribe((newEntity: ApiFile | Folder) => {
      entity.shared = newEntity.shared;

      // create share link only if the user want to save
      if (entity.shared) {
        console.log(this.gethareLink(entity)); // TODO: copy to clipboard
      }
    });
  }

  /**
   * If the streaming button should be displayed
   * @param file
   */
  displayExtraVideoOrPhotoOption(file: ApiFile): boolean {
    return (file.mimeType.includes('video') || file.mimeType.includes('image')) ? true : false;
  }

  /**
   * Stream a file or a video
   * @param row
   */
  streamFileOrVideo(row: ApiFile): void {
    if (row.mimeType.includes('video') || row.mimeType.includes('image')) {
      this.showProgressBar = true;
      this.fileService.streamImage(row).subscribe((blob: Blob) => {
        const urlCreator = window.URL;
        const dialogRef = this.dialog.open(ImageComponent, {
          data: {
            imageData: this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(blob)),
            name: row.name + row.extention,
            type: row.mimeType.includes('video') ? 'video' : 'image',
            videoType: row.mimeType.includes('video') ? row.mimeType : null
          }
        });
        this.showProgressBar = false;
      }, error => {
        console.log(error);
      });
    }
  }

  /**
   * Upload file that is deposed in the droppable zone
   * @param event
   */
  dropped(event: UploadEvent): void {
    for (const droppedFile of event.files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.uploadService.simpleUpload(file, this.route.snapshot.paramMap.get('uuid')).subscribe((d: ApiFile) => {
            // TODO: fix this below, it does not work. I think it is the upload event what stay focus on
            this.dataSource.data.push(d);
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.orderDatasource();
          }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
              const apiError: ApiError = ApiError.FROM_JSON(err.error);
              console.error(`Error during upload on drag & drop - ${apiError.status} - ${apiError.message}`);
              if (apiError.message.includes('upload size exceeded')) {
                this.openSnackBar('File too big to upload');
              }
            } else {
              console.error(err);
            }
          });
        });
      }
    }
  }

  /**
   * General function to display a snackbar
   */
  openSnackBar(message: string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 10000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }

  /**
   * Get a share link, called after share a file or folder
   * @param entity
   */
  gethareLink(entity: ApiFile | Folder): string {
    if (entity.mimeType === 'inode/directory') {
      return window.location.origin + this.router.createUrlTree(['/public/folder', entity.uuid]).toString();
    } else {
      return window.location.origin + this.router.createUrlTree(['/public/file', entity.uuid]).toString();
    }
  }
}
