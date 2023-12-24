import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { data } from './interfaces';

@Injectable({
	providedIn: 'root'
})
export class GlobalService {
	constructor(private http: HttpClient) { }
	base: HTMLBaseElement | null = document.querySelector('base')
	data: data = {
		children: undefined,
		sidebar: [],
		page: undefined,
		tree: [],
		navigation: undefined
	}
	deepestOpenedId: number | undefined
	topOpenedId: number | undefined
	isLoading = false
	getData(id: number, preventPushState?: boolean) {
		this.isLoading = true
		this.http.get<data>('api', {
			params: { id },
			responseType: 'json'
		}).subscribe({
			next: (data: data) => {
				if (data.tree.length === 0) {
					if (!preventPushState) this.pushState()
					this.changeBase()
					document.title = 'ספריית ליובאוויטש'
				}
				else {
					if (!preventPushState) this.pushState(id.toString())
					this.changeBase(id.toString())
					document.title = data.tree[data.tree.length - 1].heading + ' - ספריית ליובאוויטש'
				}
				this.data = data
				this.topOpenedId = data.tree[0]?.id
				this.deepestOpenedId = data.tree.length > 1 ? data.tree[1].id : this.topOpenedId
			},
			complete: () => this.isLoading = false
		})
	}
	removeHtmlCode(htmlCode: string): string {
		return new DOMParser().parseFromString(htmlCode, 'text/html').body.textContent || ''
	}
	pushState(path?: string) {
		history.pushState(null, '', './' + (path || ''))
	}
	changeBase(path?: string) {
		if (this.base !== null) this.base.href = './' + (path || '')
	}
}
