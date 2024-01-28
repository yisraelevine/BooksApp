import { Component } from '@angular/core';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html'
})
export class StatisticsComponent {
  constructor(public global: GlobalService) { }
  onClick() {
    alert('החיפוש בשלבי פיתוח נסה שוב יותר מאוחר')
  }
}
