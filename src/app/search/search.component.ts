import { Component } from '@angular/core';
import { GlobalService } from '../global.service';
import { idInSections } from '../helpers';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent {
  constructor(public global: GlobalService) { }
  onSubmit() {
    if (idInSections(this.global.search_form_data.section_id, this.global.main.sections)) this.global.getSearch()
    else this.global.getStatistics()
  }
}
