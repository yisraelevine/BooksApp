import { Component } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html'
})
export class ContentComponent {
  constructor(public global: GlobalService) { }
  pageClickEvent(event: MouseEvent) {
    event.preventDefault()
    const href = (event.target as HTMLElement).closest('a')?.getAttribute('href')
    if (href) this.global.commentsNavigator(href)
  }
}
