import { Component } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent {
  constructor(public global: GlobalService) { }
  onSubmit() {
    if (this.global.search_form.section_id > 0) this.global.getSearch()
    else this.global.getStatistics()
  }
}
