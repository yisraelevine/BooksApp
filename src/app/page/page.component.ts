import { Component, AfterViewInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html'
})
export class PageComponent implements AfterViewInit {
  constructor(public global: GlobalService) { }
  ngAfterViewInit() {
    if (window.location.hash) this.global.commentsNavigator(window.location.hash)
    document.querySelectorAll<HTMLAnchorElement>('app-page>div:first-of-type a').forEach(item => {
      const href = item.getAttribute('href')
      if (!href) return
      const target = document.querySelector(`#${href.slice(2)}, #${href.slice(1)}, [name=${href.slice(1)}]`)
      if (!target?.textContent) return
      item.title = target.textContent.replace(/^\s*\d+\s*\)*\s*/, '')
    })
  }
}
