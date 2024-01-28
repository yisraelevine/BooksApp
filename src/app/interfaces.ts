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
export interface statistics {
	section_id: number
	count: number
	is_parent?: boolean
	heading?: string
}
export interface main {
	tree: tree[] | undefined
	sidebar: sidebar[] | undefined
	children: children[] | undefined
	page: page | undefined
	navigation: navigation | undefined
	sections: sections[] | undefined
}