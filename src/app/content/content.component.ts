import { Component } from '@angular/core';
import { GlobalService } from '../global.service';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html'
})
export class ContentComponent {
  constructor(public global: GlobalService) { }
  pageClickEvent(event: MouseEvent) {
    event.preventDefault()
    const href = (event.target as HTMLElement).closest('a')?.getAttribute('href')
    if (href) {
      (document.getElementById(href.slice(2)) ||
        document.getElementById(href.slice(1)) ||
        document.getElementsByName(href.slice(1))[0]
      ).scrollIntoView({ behavior: 'smooth' })
    }
  }
}
