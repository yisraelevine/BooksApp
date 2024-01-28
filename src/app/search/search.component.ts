import { Component } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent {
  model: any = {
    section: 0,
    phrase: ''
  }
  constructor(public global: GlobalService) { }
  onSubmit() {
    this.model.section = 0
    this.global.getStatistics(this.model.phrase)
  }
  onClick() {
    alert('החיפוש בשלבי פיתוח נסה שוב יותר מאוחר')
  }
}
