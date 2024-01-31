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
      let element = document.getElementById(href?.substring(2))
      if (!element) element = document.getElementById(href?.substring(1))
      if (!element) element = document.getElementsByName(href?.substring(1))[0]
      element?.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
