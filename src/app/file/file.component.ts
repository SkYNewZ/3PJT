import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FileService } from './file.service';
import { File } from './file';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiListElement } from './list-element';
import { Folder } from './folder';
import { ActivatedRoute, Route, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { SharedService } from '../shared.service';
import { InputDialogComponent } from './input-dialog.component';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit, AfterViewInit {
  public showLoader: Boolean = true;
  public dataSource: MatTableDataSource<File | Folder> = new MatTableDataSource(
    []
  );
  public displayedColumns: String[] = [
    'name',
    'createdAt',
    'updatedAt',
    'actions'
  ];
  public initialSelection = [];
  public allowMultiSelect = true;
  public selection: SelectionModel<File> = new SelectionModel<File>(
    false,
    null
  );
  @ViewChild('filesTable') filesSort: MatSort;

  constructor(
    private fileService: FileService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private ss: SharedService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params['uuid']);
      this.getFiles(params['uuid']);
    });
    this.ss.getLastFileUploaded().subscribe((item: File) => {
      // push file if a new is upload
      this.dataSource.data.push(item);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.orderDatasource();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.filesSort;
  }

  getFiles(parentFolderUuid?: string): void {
    this.fileService
      .getFiles(parentFolderUuid)
      .subscribe((elements: ApiListElement) => {
        if (!(elements.files.length === 0 && elements.folders.length === 0)) {
          const e: ApiListElement = ApiListElement.FROM_JSON(elements);
          const t: (File | Folder)[] = [];
          // create the folder array
          let folderTab: Folder[] = [];
          e.folders.forEach((folder, idx) => {
            const fo: Folder = Folder.FROM_JSON(folder);
            folderTab.push(fo);
          });
          // sort
          folderTab = this.sortAlphabetically(folderTab);

          // create the file array
          let filetab: File[] = [];
          e.files.forEach((file, idx) => {
            const f: File = File.FROM_JSON(file);
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

  deleteFile(file: File) {
    console.log('delete this file');
    console.log(file);
  }

  downloadFile(file: File) {
    console.log('download this file');
    console.log(file);
  }

  renameEntity(entity: File | Folder) {
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
        this.fileService.renameFile(entity, name).subscribe((renamedFile: File) => console.log(renamedFile));
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

  navigate(row: File | Folder): void {
    if (row.mimeType === 'inode/directory') {
      this.router.navigate(['/folder', row.uuid]);
    } else {
      console.log('file redirection not set');
      this.router.navigate(['/file', row.uuid]);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(InputDialogComponent, {
      width: '250px',
      data: {
        title: 'What will be the name of the folder',
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
    const t: (File | Folder)[] = [];
    this.dataSource.data.forEach((item: File | Folder) => {
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
}
