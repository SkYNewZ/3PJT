import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-folder-creation-dialog',
  templateUrl: 'folder-creation-dialog.html'
})
export class FolderCreationDialogComponent {
  constructor(public dialogRef: MatDialogRef<FolderCreationDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
