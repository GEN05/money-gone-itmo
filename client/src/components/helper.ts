import { Transaction } from "../models/IUser";

export function dateHumanReadableFull(
  date: Date,
  full: boolean = false
): string {
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: full ? "long" : "short",
    day: "numeric",
  });
}

export function dateHumanReadableMonthYear(
  date: Date,
  full: boolean = false
): string {
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: full ? "long" : "short",
  });
}

export function dateHumanReadableMonth(
  date: Date,
  full: boolean = false
): string {
  return date.toLocaleDateString("en-GB", { month: full ? "long" : "short" });
}

export function numberWithCommas(num: number): string {
  return num
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function trnsFromLastMonth(
  trns: Transaction[],
  trnsFromBank: Transaction[]
) {
  // last updated month
  const maxDate = Math.max(
    ...trns.map((t) => t.date),
    ...trnsFromBank.map((t) => t.date)
  );
  // first day of last updated month
  const firstDayOfMonth =
    dateToYYYYMMDD(new Date(maxDate)).split("-").splice(0, 2).join("-") + "-01";
  // expenses for the last updated month
  const cashLastMonth: Transaction[] = trns.filter(
    (t) => dateToYYYYMMDD(new Date(t.date)) >= firstDayOfMonth
  );
  const cardLastMonth: Transaction[] = trnsFromBank.filter(
    (t) => dateToYYYYMMDD(new Date(t.date)) >= firstDayOfMonth
  );

  return { maxDate, cashLastMonth, cardLastMonth };
}

export const dateToYYYYMM = (date: Date): string =>
  date.toLocaleDateString("en-GB").split("/").reverse().slice(0, 2).join("-");

export const dateToYYYYMMDD = (date: Date): string =>
  date.toLocaleDateString("en-GB").split("/").reverse().join("-");
