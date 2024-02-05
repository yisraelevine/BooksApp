import { Component } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html'
})
export class ContentComponent {
  constructor(public global: GlobalService) { }
  target: HTMLElement | undefined
  pageClickEvent(event: MouseEvent) {
    event.preventDefault()
    const href = (event.target as HTMLElement).closest('a')?.getAttribute('href')
    if (href) {
      if (this.target) this.target.classList.remove('selected-comment')

      this.target = document.getElementById(href.slice(2)) ||
        document.getElementById(href.slice(1)) ||
        document.getElementsByName(href.slice(1))[0]

      if (this.target) {
        this.target.classList.add('selected-comment')
        this.target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' })
      }
    }
  }
}
