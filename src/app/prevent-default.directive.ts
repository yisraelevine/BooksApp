import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: 'a:not([no-prevent])'
})
export class PreventDefaultDirective {
    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        event.preventDefault()
    }
}