import { SafeHtml } from "@angular/platform-browser"

export interface children {
	id: number
	heading: string
	lid: number | undefined
	lheading: string | undefined
}
export interface sidebar {
	id: number
	heading: string
	children: {
		id: number,
		heading: string
	}[] | undefined
}
export interface page {
	text: SafeHtml
	haoros: SafeHtml
}
export interface tree {
	id: number
	heading: string
}
export interface navigation {
	next: number | undefined
	previous: number | undefined
}
export interface sections {
	id: number
	heading: string
	parent_id: number
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
export interface main {
	tree: tree[] | undefined
	sidebar: sidebar[] | undefined
	children: children[] | undefined
	page: page | undefined
	navigation: navigation | undefined
	sections: sections[] | undefined
}