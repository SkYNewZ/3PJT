import { Component, OnInit, ViewChild } from '@angular/core';
import { FileService } from './file.service';
import { File } from './file';
import { MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiListElement } from './list-element';
import { Folder } from './folder';
import { ActivatedRoute, Route, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {
  public showLoader: Boolean = true;
  public elements: (File | Folder)[] = [];
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

  constructor(
    private fileService: FileService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private ss: SharedService,
  ) {}

  ngOnInit() {
    this.getFiles(this.route.snapshot.paramMap.get('uuid'));
    this.ss.getLastFileUploaded().subscribe((item:  File) => {
      // push file if a new is upload
      this.dataSource.data.push(item);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
    });
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
    tab.sort(function(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
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
}
