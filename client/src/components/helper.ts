export function dateHumanReadable(date: Date, full: boolean = false): string {
    return date.toLocaleDateString("en-GB", {year: 'numeric', month: (full ? 'long' : 'short'), day: 'numeric'});
}

export function numberWithCommas(num: number): string {
    return num.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}