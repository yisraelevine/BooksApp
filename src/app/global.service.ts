import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { main, statistics } from './interfaces';

@Injectable({
	providedIn: 'root'
})
export class GlobalService {
	constructor(private http: HttpClient) { }
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

	deepestOpenedId: number | undefined
	isLoadingMain = false
	isLoadingStatistics = false

	getMain(id: number, preventPushState?: boolean) {
		this.isLoadingMain = true
		this.http.get<main>('api/main', {
			params: { id }, responseType: 'json'
		}).subscribe({
			next: (data: main) => {
				if (data.sections) {
					data.sidebar = data.sections.filter(e => e.parent_id === 0)
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
				}
				this.main = data
			},
			complete: () => this.isLoadingMain = false,
			error: () => this.isLoadingMain = false
		})
	}
	getStatistics(phrase: string) {
		this.isLoadingStatistics = true
		this.http.get<statistics[]>('api/statistics', {
			params: { phrase }, responseType: 'json'
		}).subscribe({
			next: (data: statistics[]) => data,
			complete: () => this.isLoadingStatistics = false,
			error: () => {
				this.isLoadingStatistics = false
				this.statistics = undefined
			}
		})
	}
	removeHtmlCode(htmlCode: string): string {
		return new DOMParser().parseFromString(htmlCode, 'text/html').body.textContent || ''
	}
	pushState(path?: number) {
		history.pushState(null, '', './' + (path || ''))
	}
	changeBase(path?: number) {
		if (this.base !== null) this.base.href = './' + (path || '')
	}
	changeTitle(name?: string) {
		document.title = (name ? (name + ' - ') : '') + 'ספריית ליובאוויטש'
	}
}
