import { search, section, sidebar, statistic } from './interfaces';
import replace_array from './replace_array';

export function idInSections(section_id: number, sections: section[] | undefined) {
    return sections?.findIndex(e => e.id === section_id) !== -1
}

export function generateSearch(search: search, phrase: string): search {
    return {
        ...search,
        results: search.results.map(e => ({
            ...e,
            text: markText(e.text, phrase, true)
        }))
    }
}

export function removeHtmlCode(html_code: string): string {
    const extract_text = (element: Node): string =>
        Array.from(element.childNodes).
            map(e => e.nodeType === 3 ? e.textContent : extract_text(e)).
            join(' ')
    const body = new DOMParser().parseFromString(html_code, 'text/html').body
    return extract_text(body)
}

export function pushState(path: string) {
    history.pushState(null, '', './' + path)
}

export function changeTitle(name?: string) {
    document.title = (name ? (name + ' - ') : '') + 'ספריית ליובאוויטש'
}

export function markText(text: string, phrase: string, trim?: boolean) {
    if (trim) {
        text = removeHtmlCode(text).replace(/[^א-ת"']+/g, ' ')
        let search = Math.max(text.search(phrase))
        if (search === -1) search = text.search(phrase[0])
        const pos = Math.max(search - 40, 0)
        text = text.slice(pos, pos + 100).split(' ').slice(1).join(' ')
    }
    return text.replaceAll(phrase, `<span class="color-red">${phrase}</span>`)
}

export function replaceText(text: string) {
    if (!text) return ''
    replace_array.forEach(e => text = text.replaceAll(e[0], e[1]))
    return text
}

export function extractSidebarFromSections(sections: section[]): sidebar[] {
    return sections.filter(e => e.parent_id === 0).map(e => ({ ...e, children: undefined }))
}

/**
 * Generates statistics based on the main sections and provided statistics.
 * If statistics are provided, the generated statistics are filtered using the filterStatistics function.
 * 
 * @param statistics - Optional input array of statistics to be used for generation.
 * @returns An array containing the generated statistics, or undefined if main sections are not available.
*/
export function generateStatistics(sections: section[] | undefined, statistics?: statistic[]): statistic[] | undefined {
    if (!sections) return
    const generated_statistics = sections.map(e => ({
        section_id: e.id,
        count: statistics?.filter(s => s.section_id === e.id)[0]?.count || 0,
        is_parent: e.parent_id === 0,
        heading: e.heading
    }))
    return statistics ? filterStatistics(sections, generated_statistics) : generated_statistics
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
export function filterStatistics(sections: section[], statistics: statistic[]): statistic[] {
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
export function generateOffsets(count: number, offset: number): number[] {
    const offsets_count = Math.ceil(count / 25)
    const start = Math.min(
        Math.max(offset - 5, 0),
        Math.max(offsets_count - 10, 0)
    )
    const length = Math.min(10, Math.max(offsets_count, 1))
    return generateNumberArray(start, length)
}

/**
 * Generates an array of consecutive numbers starting from a specified value.
 *
 * @param {number} start - The starting value of the number sequence.
 * @param {number} length - The length of the array to generate.
 * @returns {number[]} An array containing consecutive numbers starting from the specified value.
*/
export function generateNumberArray(start: number, length: number): number[] {
    return Array.from({ length }, (_, i) => start + i);
}

export function extractNumberFromPath(): number {
    return +window.location.pathname.replace(/\D/g, '')
}