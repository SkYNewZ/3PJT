import { Component, OnInit, OnDestroy } from '@angular/core';
import { FileService } from '../file/file.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';
import { File as ApiFile } from '../file/file';
import { ApiListElement } from '../file/list-element';
import { Folder } from '../file/folder';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { ApiError } from '../models/api-error';

@Component({
  selector: 'app-sharing',
  templateUrl: './sharing.component.html',
  styleUrls: ['./sharing.component.css']
})
export class SharingComponent implements OnInit, OnDestroy {

  private uuidSub: ISubscription;
  public showLoader: Boolean = true;
  public dataSource: MatTableDataSource<ApiFile | Folder> = new MatTableDataSource(
    []
  );
  public displayedColumns: String[] = [
    'name',
    'createdAt',
    'updatedAt'
  ];
  public selection: SelectionModel<ApiFile> = new SelectionModel<ApiFile>(
    false,
    null
  );
  public showProgressBar: Boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService,
    private location: Location,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.uuidSub = this.route.params.subscribe(params => {
      this.getFiles(params['uuid']);
    });
  }

  ngOnDestroy(): void {
    this.uuidSub.unsubscribe();
  }

  /**
   * Main function to get files from api and display it
   * @param parentFolderUuid
   */
  getFiles(parentFolderUuid?: string): void {
    this.fileService
      .getSharedFilesAndFolders(parentFolderUuid)
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
      }, (err) => {
        if (err.error === 'This folder is not shared') {
          this.openSnackBar('The folder you try to access to is not shared');
        } else {
          this.openSnackBar('Unexpected error, please try again later');
        }
        console.log(err);
        this.showLoader = false;
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
      // todo
      console.log('todo: view file on double click');
    }
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
      this.router.navigate(['/public/folder', row.uuid]);
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

}
