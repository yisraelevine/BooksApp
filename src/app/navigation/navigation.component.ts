import { Component } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent {
  constructor(public global: GlobalService) { }
}
