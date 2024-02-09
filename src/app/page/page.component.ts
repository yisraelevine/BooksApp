import { Component, AfterViewInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html'
})
export class PageComponent implements AfterViewInit {
  constructor(public global: GlobalService) { }
  ngAfterViewInit() {
    if (window.location.hash) this.global.commentsNavigator(window.location.hash)
  }
}
