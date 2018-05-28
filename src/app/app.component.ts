import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @HostListener('document:contextmenu', ['$event'])
  onDocumentRightClick(event) {
    if (event instanceof MouseEvent) {
      event.preventDefault();
    }
  }
}
