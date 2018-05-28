import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FileService } from './file.service';
import { File as ApiFile } from './file';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
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
    'updatedAt'
  ];
  public initialSelection = [];
  public allowMultiSelect = true;
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
    private uploadService: UploadService
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
      });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

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
        this.fileService.renameFile(entity, name).subscribe((renamedFile: ApiFile) => entity.name = renamedFile.name);
      }
    });
  }

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

  backClicked(): void {
    this.location.back();
  }

  navigate(row: ApiFile | Folder): void {
    if (row.mimeType === 'inode/directory') {
      this.router.navigate(['/folder', row.uuid]);
    } else if (row.mimeType.includes('video') || row.mimeType.includes('image')) {
      // todo
      console.log('todo: view file on double click');
    }
  }

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

  shareFile(entity: ApiFile | Folder): void {
    console.log('TODO: share');
  }

  displayExtraVideoOrPhotoOption(file: ApiFile): boolean {
    return (file.mimeType.includes('video') || file.mimeType.includes('image')) ? true : false;
  }

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
          });
        });
      }
    }
  }
}
