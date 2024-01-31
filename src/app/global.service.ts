import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { main, search, statistics } from './interfaces';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
	providedIn: 'root'
})
export class GlobalService {
	constructor(private http: HttpClient, public sanitizer: DomSanitizer) { }
	base: HTMLBaseElement | null = document.querySelector('base')

	main: main = {
		children: undefined,
		sidebar: undefined,
		page: undefined,
		tree: undefined,
		navigation: undefined,
		sections: undefined
	}
	statistics: statistics[] | undefined
	search: search | undefined

	search_form = {
		section_id: 0,
		phrase: ''
	}
	deepestOpenedId: number | undefined
	isLoadingMain = false
	isLoadingStatistics = false
	clickedPage = false
	current_phrase = ''

	getMain(id: number, preventPushState?: boolean, mark?: boolean) {
		this.isLoadingMain = true
		this.http.get<main>('api/main', {
			params: { id }, responseType: 'json'
		}).subscribe({
			next: (data: main) => {
				if (data.sections) {
					data.sidebar = data.sections.filter(e => e.parent_id === 0).map(e => ({ ...e, children: undefined }))
					this.deepestOpenedId = undefined

					if (!preventPushState) this.pushState()
					this.changeTitle()
					this.changeBase()
				}
				else if (data.tree) {
					this.deepestOpenedId = data.tree.length > 1 ? data.tree[1].id : data.tree[0].id

					if (!preventPushState) this.pushState(id)
					this.changeTitle(data.tree[data.tree.length - 1].heading)
					this.changeBase(id)

					if (data.page?.text) {
						if (mark) data.page.text = this.markText(data.page.text as string, this.current_phrase)
						data.page.text = this.makeHtmlValid(data.page.text)
					}
					if (data.page?.haoros) data.page.haoros = this.makeHtmlValid(data.page.haoros)
				}
				this.main = data
			},
			complete: () => this.isLoadingMain = false,
			error: () => this.isLoadingMain = false
		})
	}
	getStatistics() {
		this.search = undefined
		this.isLoadingStatistics = true
		this.generateStatistics()
		this.http.get<statistics[]>('api/statistics', {
			params: { phrase: this.search_form.phrase }, responseType: 'json'
		}).subscribe({
			next: (data: statistics[]) => this.generateStatistics(data),
			complete: () => this.isLoadingStatistics = false,
			error: () => {
				this.isLoadingStatistics = false
				this.statistics = undefined
			}
		})
	}
	getSearch(offset?: number) {
		const phrase = this.search_form.phrase.replace(/[^א-ת"']+/g, ' ')
		this.http.get<search>('api/search', {
			params: { phrase, section_id: this.search_form.section_id, offset: offset || 0 }, responseType: 'json'
		}).subscribe({
			next: (data: search) => {
				const count = data.results.length
				data.results = data.results.map(e => ({
					...e, text: e.text = this.markText(e.text, phrase, true)
				})).filter(e => e.text)
				data.count = data.count - (count - data.results.length)
				this.search = data
			},
			complete: () => this.current_phrase = phrase
		})
	}
	removeHtmlCode(htmlCode: string): string {
		const asd: any = (element: any) => Array.from(element.childNodes).map((e: any) => e.nodeType === 3 ? e.textContent : asd(e)).join(' ')
		const body = new DOMParser().parseFromString(htmlCode, 'text/html').body
		return asd(body).replace(/[^א-ת"']+/g, ' ')
	}
	pushState(path?: number) {
		history.pushState(null, '', './' + (path || ''))
	}
	changeBase(path?: number) {
		this.base!.href = './' + (path || '')
	}
	changeTitle(name?: string) {
		document.title = (name ? (name + ' - ') : '') + 'ספריית ליובאוויטש'
	}
	generateStatistics(statistics?: statistics[]) {
		this.statistics = this.main.sections?.map(e => ({
			section_id: e.id,
			count: statistics?.filter(d => d.section_id === e.id)[0]?.count || 0,
			is_parent: e.parent_id === 0,
			heading: e.heading
		})).filter(e => !statistics || e.count !== 0 ||
			(e.is_parent && this.main.sections?.some(s => s.parent_id === e.section_id &&
				statistics.some(a => a.section_id === s.id && a.count !== 0))))
	}
	markText(text: string, phrase: string, remove_html?: boolean) {
		if (remove_html) {
			text = this.removeHtmlCode(text)
			const search = text.search(phrase)
			if (search === -1) return ''
			const pos = Math.max(search - 30, 0)
			text = text.slice(pos, pos + 80).split(' ').slice(1).join(' ')
		}
		return text.replaceAll(phrase, `<span class="color-red">${phrase}</span>`)
	}
	replaceString(str: string) {
		return (str?.replaceAll("[cup]", "<span class=cup>")
			.replaceAll("[/cup]", "</span>") || '')
	}
	makeHtmlValid(str: SafeHtml) {
		return this.sanitizer.bypassSecurityTrustHtml(str as string)
	}
}
