import { Component } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html'
})
export class StatisticsComponent {
  constructor(public global: GlobalService) { }
  onClick(section_id: number) {
    this.global.search_form_data.section_id = section_id
    this.global.getSearch()
  }
  statisticHref(section_id: number) {
    return `search?phrase=${this.global.search_form_data.phrase}&section_id=${section_id}`
  }
}
