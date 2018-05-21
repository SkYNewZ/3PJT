import { Component, OnInit, ViewChild } from '@angular/core';
import { FileService } from './file.service';
import { File } from './file';
import { MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {

  public files: File[] = [];
  public dataSource: MatTableDataSource<File>;
  public displayedColumns: String[] = ['select', 'name', 'createdAt', 'updatedAt', 'actions'];
  public showLoader: Boolean = true;
  public initialSelection = [];
  public allowMultiSelect = true;
  public selection: SelectionModel<File>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fileService: FileService
  ) { }

  ngOnInit() {
    this.getFiles();
    this.dataSource.sort = this.sort;
    this.selection = new SelectionModel<File>(this.allowMultiSelect, this.initialSelection);
  }

  getFiles(): void {
    this.fileService.getFiles().subscribe((files: File[]) => {
      this.dataSource = new MatTableDataSource(files);
      this.showLoader = false;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  deleteFile(file: File) {
    console.log(file);
  }

  downloadFile(file: File) {
    console.log(file);
  }

  copyFile(file: File) {
    console.log(file);
  }

}
