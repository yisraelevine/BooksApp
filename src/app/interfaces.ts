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
export interface sections {
	id: number
	heading: string
	parent_id: number
	children: undefined
}
export interface sections {
	id: number
	heading: string
	parent_id: number
	children: undefined
}
export interface statistics {
	id: number
	count: number
}
export interface search {
	sections: sections[]
	results: undefined
}
export interface data {
	children: children[] | undefined
	sidebar: sidebar[] | undefined
	page: page | undefined
	tree: tree[] | undefined
	navigation: navigation | undefined
	sections: sections[] | undefined
	statistics: statistics[] | undefined
}