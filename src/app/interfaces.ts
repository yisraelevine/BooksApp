import { SafeHtml } from "@angular/platform-browser"

export interface sidebar {
	id: number
	heading: string
	children: {
		id: number,
		heading: string
	}[] | undefined
}
export interface tree {
	id: number
	heading: string
}
export interface sections {
	id: number
	heading: string
	parent_id: number
}
export interface nav {
	next: number | undefined
	previous: number | undefined
}
export interface children {
	id: number
	heading: string
	left: {
		id: number
		heading: string
	} | undefined
}
export interface statistics {
	section_id: number
	count: number
	is_parent?: boolean
	heading?: string
}
export interface result {
	mafteach_id: number
	tree: string
	text: string
}
export interface search {
	count: number
	results: result[]
}
export interface page {
	nav: nav
	text: SafeHtml
	haoros: SafeHtml
}
export interface main {
	tree: tree[] | undefined
	sidebar: sidebar[] | undefined
	page: page | undefined
	children: children[] | undefined
	sections: sections[] | undefined
}