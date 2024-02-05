import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { main, statistic, search } from './interfaces';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { changeTitle, extractSidebarFromSections, generateOffsets, generateSearch, generateStatistics, markText, pushState, removeHtmlCode, replaceText } from './helpers';

@Injectable({
	providedIn: 'root'
})
export class GlobalService {
	constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

	main: main = {
		tree: undefined,
		sidebar: undefined,
		page: undefined,
		children: undefined,
		sections: undefined
	}
	statistics: statistic[] | undefined
	search: search | undefined

	search_form_data = { section_id: 0, phrase: '' }
	sidebar_deepest: number | undefined
	current_phrase = ''
	current_offset: number | undefined
	offsets: number[] | undefined
	selected_result_page: number | undefined
	loading_main: boolean = false
	loading_statistics: boolean = false

	getMain(id: number, preventPushState?: boolean, mark?: boolean) {
		this.loading_main = true
		return this.http.get<main>('api/main', {
			params: { id }
		}).subscribe({
			next: data => {
				if (data.tree) data.tree = data.tree.map(e => ({ ...e, heading: removeHtmlCode(e.heading) }))
				if (data.sections) data.sidebar = extractSidebarFromSections(data.sections)
				else if (data.page) {
					data.page.text = replaceText(data.page.text as string)
					data.page.haoros = replaceText(data.page.haoros as string)
					if (mark && this.current_phrase) {
						data.page.text = markText(data.page.text as string, this.current_phrase)
					}
					data.page.text = this.makeHtmlValid(data.page.text as string)
					data.page.haoros = this.makeHtmlValid(data.page.haoros as string)
				}
				else if (data.children)
					data.children = data.children.map(e => ({
						...e,
						heading: removeHtmlCode(e.heading),
						left: e.left ? { ...e.left, heading: removeHtmlCode(e.left.heading) } : undefined
					}))
				this.sidebar_deepest = data.tree?.[Math.min(1, data.tree.length - 1)]?.id
				if (!preventPushState) pushState(id > 0 ? id.toString() : '')
				changeTitle(data.tree?.at(-1)?.heading)
				this.main = data
			},
			complete: () => this.loading_main = false,
			error: () => this.loading_main = false
		})
	}
	getStatistics() {
		this.search = undefined
		this.statistics = generateStatistics(this.main.sections)
		this.loading_statistics = true
		this.http.get<statistic[]>('api/statistics', {
			params: { phrase: this.search_form_data.phrase }
		}).subscribe({
			next: data => this.statistics = generateStatistics(this.main.sections, data),
			complete: () => this.loading_statistics = false,
			error: () => this.loading_statistics = false
		})
	}
	getSearch(offset?: number) {
		if (offset !== undefined && offset === this.current_offset) return
		const phrase = this.search_form_data.phrase.replace(/[^א-ת"']+/g, ' ')
		this.http.get<search>('api/search', {
			params: { phrase, section_id: this.search_form_data.section_id, offset: offset || 0 }
		}).subscribe({
			next: data => {
				this.search = generateSearch(data, phrase)
				this.offsets = generateOffsets(data.count, offset || 0)
			},
			complete: () => {
				this.current_offset = offset || 0
				this.current_phrase = phrase
				document.querySelector('app-results')?.scrollIntoView()
			}
		})
	}
	makeHtmlValid(string: string) {
		return this.sanitizer.bypassSecurityTrustHtml(string)
	}
}
