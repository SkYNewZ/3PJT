import { Component, HostListener } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @HostListener('document:contextmenu', ['$event'])
  onDocumentRightClick(event) {
    if (event instanceof MouseEvent && environment.production) {
      event.preventDefault();
    }
  }
}
