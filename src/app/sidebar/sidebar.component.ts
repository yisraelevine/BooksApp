import { Component } from '@angular/core'
import { GlobalService } from '../global.service'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  constructor(public global: GlobalService) { }
  isDeepest = (id: number) => this.global.deepestOpenedId === id
}
