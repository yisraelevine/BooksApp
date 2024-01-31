import { Component } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html'
})
export class ChildrenComponent {
  constructor(public global: GlobalService) { }
}
