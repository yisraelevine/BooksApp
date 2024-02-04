import { Component, OnInit } from '@angular/core';
import { GlobalService } from './global.service';
import { idInSections } from './helpers';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    constructor(public global: GlobalService) { }
    ngOnInit() {
        window.addEventListener('popstate', () =>
            this.global.getMain(+window.location.pathname.replace(/\D/g, ''), true, true))
        this.global.getMain(+window.location.pathname.replace(/\D/g, ''), true).add(() => {
            const url = new URL(window.location.href)
            this.global.search_form_data.phrase = url.searchParams.get('phrase') || ''
            this.global.search_form_data.section_id = +(url.searchParams.get('section_id') || '')
            console.log()
            if (url.pathname.includes('search')) {
                if (idInSections(this.global.search_form_data.section_id, this.global.main.sections))
                    this.global.getSearch()
                else this.global.getStatistics()
            }
        })
    }
}
