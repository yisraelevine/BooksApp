import { Component } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html'
})
export class PageComponent {
  constructor(public global: GlobalService) { }
}
