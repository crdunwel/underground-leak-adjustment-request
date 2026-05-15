/* src/lib/formatters.ts */

export function formatPhoneNumber(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 10)

    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`

    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export function formatZip(value: string) {
    return value.replace(/\D/g, '').slice(0, 5)
}

export function makeSafeFilenamePart(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

export function formatDateForPdf(value: string) {
    if (!value) return ''

    const [year, month, day] = value.split('-')

    if (!year || !month || !day) return value

    return `${month}/${day}/${year}`
}

export function joinCityStateZip(city: string, state: string, zip: string) {
    return [city.trim(), state.trim(), zip.trim()].filter(Boolean).join(', ')
}