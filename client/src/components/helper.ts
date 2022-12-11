export function dateHumanReadableFull(date: Date, full: boolean = false): string {
    return date.toLocaleDateString("en-GB", {year: 'numeric', month: (full ? 'long' : 'short'), day: 'numeric'});
}

export function dateHumanReadableMonthYear(date: Date, full: boolean = false): string {
    return date.toLocaleDateString("en-GB", {year: 'numeric', month: (full ? 'long' : 'short')});
}

export function dateHumanReadableMonth(date: Date, full: boolean = false): string {
    return date.toLocaleDateString("en-GB", {month: (full ? 'long' : 'short')});
}

export function numberWithCommas(num: number): string {
    return num.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const dateToYYYYMM = (date: Date): string => date.toLocaleDateString("en-GB").split('/').reverse().slice(0, 2).join('-');

export const dateToYYYYMMDD = (date: Date): string => date.toLocaleDateString("en-GB").split('/').reverse().join('-');