import { Component } from '@angular/core';
import { GlobalService } from '../global.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html'
})
export class ContentComponent {
  constructor(public global: GlobalService, public sanitizer: DomSanitizer) { }
  extractNonHtmlCode(htmlString: string): string {
    const nonHtmlCode = htmlString.replace(/<[^>]*>|[\r\n]+/g, '');
    return nonHtmlCode;
  }
  isNumber(str: string) {
    return !isNaN(parseFloat(str)) && isFinite(Number(str))
  }
  replaceString(str: string) {
    return str.replaceAll("[cup]", "<span class=cup>")
      .replaceAll("[/cup]", "</span>")
  }
}
