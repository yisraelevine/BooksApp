import { Component, AfterViewInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html'
})
export class ResultsComponent implements AfterViewInit {
  constructor(public global: GlobalService) { }
  ngAfterViewInit() {
    document.querySelector('app-results .selected')?.scrollIntoView({ block: 'center' })
  }
}
