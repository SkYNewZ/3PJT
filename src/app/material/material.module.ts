import { NgModule } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
  MatFormFieldModule,
  MatIconRegistry
} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
  exports: [
    CdkTableModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    MatFormFieldModule
  ]
})
export class MaterialModule {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'drive_doc',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/svg_icons/doc_color.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'drive_audio',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/svg_icons/audio_color.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'drive_excel',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/svg_icons/excel_color.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'drive_html',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/svg_icons/html_color.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'drive_image',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/svg_icons/images_color.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'drive_movie',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/svg_icons/movie_color.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'drive_pdf',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/svg_icons/pdf_color.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'drive_presentation',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/svg_icons/presentation_color.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'drive_sheet',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/svg_icons/tables_color.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'drive_video',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/svg_icons/video_color.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'drive_zip',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/svg_icons/zip_color.svg'
      )
    );
  }
}
