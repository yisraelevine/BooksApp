import { Component } from '@angular/core';
import { GlobalService } from './global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(public global: GlobalService) {
    global.getMain(Number(window.location.pathname.replace(/\D/g, '')), true);
    window.addEventListener('popstate', () => global.getMain(+window.location.pathname.replace(/\D/g, ''), true));
  }
}
