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
  generateStatistics() {
    return this.global.data.sections?.map(e => {
      return {
        id: e.id,
        heading: e.heading,
        count: this.global.data.statistics?.filter(s => s.id === e.id)[0]?.count || 0,
        is_parent: e.parent_id === 0
      }
    })
  }
}
