import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { main, search, statistics } from './interfaces';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import replace_array from './replace_array';

@Injectable({
	providedIn: 'root'
})
export class GlobalService {
	constructor(private http: HttpClient, public sanitizer: DomSanitizer) { }
	base: HTMLBaseElement | null = document.querySelector('base')

	main: main = {
		tree: undefined,
		sidebar: undefined,
		page: undefined,
		children: undefined,
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
	current_offset = 0

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

					if (data.page) {
						data.page.text = this.makeHtmlValid(mark ?
							this.markText(data.page.text as string, this.current_phrase) : data.page.text)
						data.page.haoros = this.makeHtmlValid(data.page.haoros)
					}
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
		this.statistics = this.generateStatistics()
		this.http.get<statistics[]>('api/statistics', {
			params: { phrase: this.search_form.phrase }, responseType: 'json'
		}).subscribe({
			next: (data: statistics[]) => {
				if (!this.search) this.statistics = this.generateStatistics(data)
			},
			complete: () => this.isLoadingStatistics = false,
			error: () => {
				this.isLoadingStatistics = false
				this.statistics = undefined
			}
		})
	}
	getSearch(offset?: number) {
		this.statistics = undefined
		const phrase = this.search_form.phrase.replace(/[^א-ת"']+/g, ' ')
		this.http.get<search>('api/search', {
			params: {
				phrase,
				section_id: this.search_form.section_id,
				offset: offset || 0
			},
			responseType: 'json'
		}).subscribe({
			next: (data: search) => this.search = {
				...data,
				results: data.results.map(e => ({
					...e,
					text: this.markText(e.text, phrase, true)
				}))
			},
			complete: () => {
				this.current_offset = offset || 0
				this.current_phrase = phrase
			}
		})
	}
	removeHtmlCode(html_code: string): string {
		const extract_text = (element: Node): string =>
			Array.from(element.childNodes).
				map(e => e.nodeType === 3 ? e.textContent : extract_text(e)).
				join(' ')
		const body = new DOMParser().parseFromString(html_code, 'text/html').body
		return extract_text(body)
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

	markText(text: string, phrase: string, remove_html?: boolean) {
		if (remove_html) {
			text = this.removeHtmlCode(text).replace(/[^א-ת"']+/g, ' ')
			let search = Math.max(text.search(phrase))
			if (search === -1) search = text.search(phrase[0])
			const pos = Math.max(search - 40, 0)
			text = text.slice(pos, pos + 90).split(' ').slice(1).join(' ')
		}
		return text.replaceAll(phrase, `<span class="color-red">${phrase}</span>`)
	}
	replaceString(text: string) {
		if (!text) return ''
		replace_array.forEach(e => text = text.replaceAll(e[0], e[1]))
		return text
	}
	makeHtmlValid(text: SafeHtml) {
		return this.sanitizer.bypassSecurityTrustHtml(text as string)
	}

	/**
	 * Generates statistics based on the main sections and provided statistics.
	 * If statistics are provided, the generated statistics are filtered using the filterStatistics function.
	 * 
	 * @param statistics - Optional input array of statistics to be used for generation.
	 * @returns An array containing the generated statistics, or undefined if main sections are not available.
	*/
	generateStatistics(statistics?: statistics[]): statistics[] | undefined {
		if (!this.main.sections) return

		const generated_statistics = this.main.sections.map(e => ({
			section_id: e.id,
			count: statistics?.filter(s => s.section_id === e.id)[0]?.count || 0,
			is_parent: e.parent_id === 0,
			heading: e.heading
		}))

		return statistics ? this.filterStatistics(generated_statistics) : generated_statistics
	}

	/**
	 * Filters the provided statistics array based on the following conditions:
	 * 
	 * 1. Include statistics with count !== 0.
	 * 2. Include statistics that are parent with non-zero count children.
	 * 
	 * @param statistics - The input array of statistics to be filtered.
	 * @returns An array containing the filtered statistics.
	 */
	filterStatistics(statistics: statistics[]): statistics[] {
		return statistics.filter(e => e.count !== 0 || (
			e.is_parent &&
			this.main.sections?.some(s => s.parent_id === e.section_id &&
				statistics?.some(a => a.section_id === s.id && a.count !== 0))))
	}

	/**
	 * Generates an array of numbers starting from starting_number calculated
	 * length is 10 or less
	 * @returns {number[]} Array of numbers.
	*/
	generateOffsets(): number[] {
		const offsets = Math.ceil(this.search!.count / 25)
		const starting_number = Math.min(
			Math.max(this.current_offset - 5, 0),
			Math.max(offsets - 10, 0)
		)
		return Array.from({ length: Math.min(10, Math.max(offsets, 1)) }, (_, index) => index + starting_number);
	}
}
