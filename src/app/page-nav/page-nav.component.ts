import { Component } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-page-nav',
  templateUrl: './page-nav.component.html'
})
export class PageNavComponent {
  constructor(public global: GlobalService) { }
}
