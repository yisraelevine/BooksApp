import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { main, search, sections, statistics } from './interfaces';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import replace_array from './replace_array';

@Injectable({
	providedIn: 'root'
})
export class GlobalService {
	constructor(private http: HttpClient, public sanitizer: DomSanitizer) { }

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
	current_phrase = ''
	current_offset: number | undefined
	offsets: number[] | undefined
	selected_page: number | undefined

	getMain(id: number, preventPushState?: boolean, mark?: boolean) {
		this.isLoadingMain = true
		this.http.get<main>('api/main', {
			params: { id }, responseType: 'json'
		}).subscribe({
			next: data => {
				if (data.sections)
					data.sidebar = data.sections.filter(e => e.parent_id === 0).
						map(e => ({ ...e, children: undefined }))
				else if (data.page) {
					this.selected_page = id
					data.page.text = this.replaceText(data.page.text as string)
					data.page.text = this.makeHtmlValid(mark ?
						this.markText(data.page.text as string, this.current_phrase) :
						data.page.text)
					data.page.haoros = this.makeHtmlValid(data.page.haoros)
				}
				this.deepestOpenedId = data.tree?.[Math.min(1, data.tree.length - 1)]?.id
				if (!preventPushState) this.pushState(id)
				this.changeTitle(data.tree?.at(-1)?.heading || '')
				this.main = data
			},
			complete: () => {
				this.isLoadingMain = false
				document.documentElement.scrollTop = 0
			},
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
			next: data => {
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
			next: data => {
				this.search = {
					...data,
					results: data.results.map(e => ({
						...e,
						text: this.markText(e.text, phrase, true)
					}))
				}
				this.offsets = this.generateOffsets(data.count, offset || 0)
			},
			complete: () => {
				this.current_offset = offset || 0
				this.current_phrase = phrase
				document.documentElement.scrollTop = 0
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
	pushState(path: number) {
		history.pushState(null, '', './' + (path || ''))
	}
	changeTitle(name: string) {
		document.title = (name ? (name + ' - ') : name) + 'ספריית ליובאוויטש'
	}
	markText(text: string, phrase: string, trim?: boolean) {
		if (trim) {
			text = this.removeHtmlCode(text).replace(/[^א-ת"']+/g, ' ')
			let search = Math.max(text.search(phrase))
			if (search === -1) search = text.search(phrase[0])
			const pos = Math.max(search - 40, 0)
			text = text.slice(pos, pos + 100).split(' ').slice(1).join(' ')
		}
		return text.replaceAll(phrase, `<span class="color-red">${phrase}</span>`)
	}
	replaceText(text: string) {
		if (!text) return ''
		replace_array.forEach(e => text = text.replaceAll(e[0], e[1]))
		return text
	}

	/**
	 * Makes HTML content valid by bypassing security and trusting the provided SafeHtml.
	 *
	 * @param html - The HTML content to be sanitized and made valid.
	 * @returns A SafeHtml object representing the sanitized and valid HTML content.
	 */
	makeHtmlValid(html: SafeHtml): SafeHtml {
		return this.sanitizer.bypassSecurityTrustHtml(html as string);
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

		return statistics ? this.filterStatistics(this.main.sections, generated_statistics) : generated_statistics
	}

	/**
	 * Filters the provided statistics array based on the following conditions:
	 * 
	 * 1. Include statistics with count !== 0.
	 * 2. Include parents with non-zero count children.
	 * 
	 * @param {Section[]} sections - An array of section objects.
	 * @param {Statistics[]} statistics - An array of statistics objects.
	 * @returns {Statistics[]} Filtered array of statistics based on specified conditions.
	*/
	filterStatistics(sections: sections[], statistics: statistics[]): statistics[] {
		return statistics.filter(e => {
			const some_children_count_is_not_tero =
				sections.some(s => s.parent_id === e.section_id &&
					statistics.some(a => a.section_id === s.id && a.count !== 0))


			return e.count !== 0 || (e.is_parent && some_children_count_is_not_tero)
		})
	}

	/**
	 * Generates an array of numbers starting from starting_number calculated
	 * length is 10 or less
	 * @returns {number[]} Array of offset numbers.
	*/
	generateOffsets(count: number, offset: number): number[] {
		const offsets_count = Math.ceil(count / 25)
		const start = Math.min(
			Math.max(offset - 5, 0),
			Math.max(offsets_count - 10, 0)
		)
		const length = Math.min(10, Math.max(offsets_count, 1))
		return this.generateNumberArray(start, length)
	}

	/**
	 * Generates an array of consecutive numbers starting from a specified value.
	 *
	 * @param {number} start - The starting value of the number sequence.
	 * @param {number} length - The length of the array to generate.
	 * @returns {number[]} An array containing consecutive numbers starting from the specified value.
	*/
	generateNumberArray(start: number, length: number): number[] {
		return Array.from({ length }, (_, i) => start + i);
	}
}
