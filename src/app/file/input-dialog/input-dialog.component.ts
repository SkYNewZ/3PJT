import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-dialog',
  templateUrl: 'input-dialog.html'
})
export class InputDialogComponent implements OnInit {

  public form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<InputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, buttonOkay: string, input?: string },
    private formBuilder: FormBuilder,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      input: this.data.input
    });
  }

  onSubmit(): void {
    this.dialogRef.close(this.form.get('input').value);
  }
}
