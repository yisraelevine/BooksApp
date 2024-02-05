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
            const phrase = url.searchParams.get('phrase') || ''

            if (!url.pathname.includes('search') || !phrase) return

            const section_id = +(url.searchParams.get('section_id') || '')
            const is_section = idInSections(section_id, this.global.main.sections)
            
            this.global.search_form_data.phrase = phrase
            this.global.search_form_data.section_id = is_section ? section_id : 0

            if (is_section) this.global.getSearch()
            else this.global.getStatistics()
        })
    }
}
