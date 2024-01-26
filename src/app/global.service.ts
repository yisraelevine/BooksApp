import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { data, statistics } from './interfaces';

@Injectable({
	providedIn: 'root'
})
export class GlobalService {
	constructor(private http: HttpClient) { }
	base: HTMLBaseElement | null = document.querySelector('base')
	data: data = {
		children: undefined,
		sidebar: undefined,
		page: undefined,
		tree: undefined,
		navigation: undefined,
		sections: undefined,
		statistics: undefined
	}
	deepestOpenedId: number | undefined
	isLoading = false
	isLoadingStatistics = false
	getData(id: number, preventPushState?: boolean) {
		this.isLoading = true
		this.http.get<data>('api/main', {
			params: { id },
			responseType: 'json'
		}).subscribe({
			next: (data: data) => {
				if (data.tree) {
					this.changeTitle(data.tree[data.tree.length - 1].heading)
					this.deepestOpenedId = data.tree.length > 1 ? data.tree[1].id : data.tree[0].id
				} else this.changeTitle()
				if (!preventPushState) this.pushState(id)
				this.changeBase(id)
				if (data.sections) data.sidebar = data.sections.filter(e => e.parent_id === 0)
				this.data = data
			},
			complete: () => this.isLoading = false
		})
	}
	getStatistics(phrase: string) {
		this.deepestOpenedId = undefined
		this.data.statistics = undefined
		this.isLoadingStatistics = true
		this.http.get<statistics[]>('api/statistics', {
			params: { phrase },
			responseType: 'json'
		}).subscribe({
			next: (data: statistics[]) => this.data.statistics = data,
			complete: () => this.isLoadingStatistics = false,
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
