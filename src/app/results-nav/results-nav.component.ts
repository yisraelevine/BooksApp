import { Component } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-results-nav',
  templateUrl: './results-nav.component.html'
})
export class ResultsNavComponent {
  constructor(public global: GlobalService) { }
}
