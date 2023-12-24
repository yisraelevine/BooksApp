import { Component } from '@angular/core';
import { GlobalService } from './global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(public global: GlobalService) {
    global.getData(Number(window.location.pathname.replace(/\D/g, '')));
    window.addEventListener('popstate', () => global.getData(Number(window.location.pathname.replace(/\D/g, '')), true));
  }
}
