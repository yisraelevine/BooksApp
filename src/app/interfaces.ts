import { SafeHtml } from "@angular/platform-browser"

export interface sidebar {
	id: number
	heading: string
	children?: {
		id: number,
		heading: string
	}[]
}
export interface tree {
	id: number
	heading: string
}
export interface section {
	id: number
	heading: string
	parent_id: number
}
export interface nav {
	next?: number
	previous?: number
}
export interface child {
	id: number
	heading: string
	left?: {
		id: number
		heading: string
	}
}
export interface result {
	mafteach_id: number
	tree: string
	text: string
}
export interface page {
	nav: nav
	text: SafeHtml
	haoros: SafeHtml
}
export interface main {
	tree?: tree[]
	sidebar?: sidebar[]
	page?: page
	children?: child[]
	sections?: section[]
}
export interface statistic {
	section_id: number
	count: number
	is_parent?: boolean
	heading?: string
}
export interface search {
	count: number
	results: result[]
}