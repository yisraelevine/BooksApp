export interface children {
	id: number
	heading: string
	lid: number
	lheading: string
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
	text: string
	haoros: string
}
export interface tree {
	id: number
	heading: string
}
export interface navigation {
	next: number | undefined
	previous: number | undefined
}
export interface data {
	children: children[] | undefined
	sidebar: sidebar[]
	page: page | undefined
	tree: tree[]
	navigation: navigation | undefined
}