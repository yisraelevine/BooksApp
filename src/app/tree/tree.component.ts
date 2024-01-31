import { Component } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html'
})
export class TreeComponent {
  constructor(public global: GlobalService) { }
}
