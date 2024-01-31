import { Component } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html'
})
export class StatisticsComponent {
  constructor(public global: GlobalService) { }
  onClick(section_id: number) {
    this.global.search_form.section_id = section_id
    this.global.getSearch()
  }
}
