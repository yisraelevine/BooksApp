import { Component } from '@angular/core';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html'
})
export class StatisticsComponent {
  constructor(public global: GlobalService) {
    global.statistics = global.main.sections?.map(e => ({
      section_id: e.id,
      count: global.statistics?.filter(d => d.section_id === e.id)[0]?.count || 0,
      is_parent: e.parent_id === 0,
      heading: e.heading
    }))
  }
  onClick() {
    alert('החיפוש בשלבי פיתוח נסה שוב יותר מאוחר')
  }
}
