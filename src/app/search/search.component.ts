import { Component } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent {
  model: any = {
    section: 0
  }
  constructor(public global: GlobalService) { }
  onSubmit() {
    alert('החיפוש בשלבי פיתוח נסה שוב יותר מאוחר')
  }
}
