// Nepali Bikram Sambat (B.S.) Calendar & Live Clock Engine

const NEPALI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

export const NEPALI_DAYS_FULL = [
  "आइतबार",
  "सोमबार",
  "मंगलबार",
  "बुधबार",
  "बिहिबार",
  "शुक्रबार",
  "शनिबार",
];

export const NEPALI_DAYS_SHORT = [
  "आइत",
  "सोम",
  "मंगल",
  "बुध",
  "बिहि",
  "शुक्र",
  "शनि",
];

export const NEPALI_MONTHS = [
  "वैशाख", // Baisakh (1)
  "जेठ",   // Jestha (2)
  "असार",  // Ashadh (3)
  "साउन",  // Shrawan (4)
  "भदौ",   // Bhadra (5)
  "असोज",  // Ashwin (6)
  "कात्तिक", // Kartik (7)
  "मंसिर",  // Mangsir (8)
  "पुस",   // Poush (9)
  "माघ",   // Magh (10)
  "फागुन",  // Falgun (11)
  "चैत",   // Chaitra (12)
];

// Number of days in each month of Bikram Sambat from 2070 BS to 2090 BS
// [Baisakh, Jestha, Ashadh, Shrawan, Bhadra, Ashwin, Kartik, Mangsir, Poush, Magh, Falgun, Chaitra]
const BS_MONTH_DAYS: Record<number, number[]> = {
  2070: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2071: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2072: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2073: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2074: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2075: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2076: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2077: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2078: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2079: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2081: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2082: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2083: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2084: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2085: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2086: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2087: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2088: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2089: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2090: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
};

// Reference point: 2070 BS Baisakh 1 = 2013-04-14 (Sunday)
const REF_AD_YEAR = 2013;
const REF_AD_MONTH = 3; // April (0-indexed)
const REF_AD_DAY = 14;
const REF_BS_YEAR = 2070;

export function toNepaliNumber(num: number | string): string {
  return String(num)
    .split("")
    .map((char) => {
      const digit = parseInt(char, 10);
      return !isNaN(digit) ? NEPALI_DIGITS[digit] : char;
    })
    .join("");
}

export interface NepaliDateObj {
  bsYear: number;
  bsMonth: number; // 1-12
  bsDay: number;   // 1-32
  bsMonthName: string;
  dayOfWeek: string;
  dayOfWeekShort: string;
}

export function convertADToBS(date: Date): NepaliDateObj {
  const refDate = new Date(REF_AD_YEAR, REF_AD_MONTH, REF_AD_DAY);
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  let totalDaysDiff = Math.floor((targetDate.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));

  let currentBsYear = REF_BS_YEAR;
  let currentBsMonth = 0; // 0-indexed (0 = Baisakh)
  let currentBsDay = 1;

  if (totalDaysDiff >= 0) {
    while (totalDaysDiff > 0) {
      const yearDays = BS_MONTH_DAYS[currentBsYear] || [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30];
      const monthDays = yearDays[currentBsMonth];

      if (totalDaysDiff >= monthDays) {
        totalDaysDiff -= monthDays;
        currentBsMonth++;
        if (currentBsMonth > 11) {
          currentBsMonth = 0;
          currentBsYear++;
        }
      } else {
        currentBsDay += totalDaysDiff;
        totalDaysDiff = 0;
      }
    }
  } else {
    // For earlier dates fallback
    currentBsYear = date.getFullYear() + 57;
    currentBsMonth = (date.getMonth() + 8) % 12;
    currentBsDay = date.getDate();
  }

  const dayIndex = date.getDay();

  return {
    bsYear: currentBsYear,
    bsMonth: currentBsMonth + 1,
    bsDay: currentBsDay,
    bsMonthName: NEPALI_MONTHS[currentBsMonth] || "वैशाख",
    dayOfWeek: NEPALI_DAYS_FULL[dayIndex],
    dayOfWeekShort: NEPALI_DAYS_SHORT[dayIndex],
  };
}

export function formatLiveDateTime(date: Date, lang: "en" | "ne"): string {
  if (lang === "en") {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString("en-US", options);
  }

  // Nepali Bikram Sambat Live Format
  const nepaliDate = convertADToBS(date);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  let period = "बिहान"; // Morning
  if (hours >= 12 && hours < 16) {
    period = "दिउँसो"; // Afternoon
  } else if (hours >= 16 && hours < 20) {
    period = "साँझ"; // Evening
  } else if (hours >= 20 || hours < 4) {
    period = "राति"; // Night
  }

  const displayHours = hours % 12 || 12;
  const nepaliHours = toNepaliNumber(displayHours.toString().padStart(2, "0"));
  const nepaliMinutes = toNepaliNumber(minutes);
  const nepaliSeconds = toNepaliNumber(seconds);
  const nepaliDay = toNepaliNumber(nepaliDate.bsDay);
  const nepaliYear = toNepaliNumber(nepaliDate.bsYear);

  // E.g. "सोमबार, १५ भदौ २०८३ | बिहान ०४:३७:१३"
  return `${nepaliDate.dayOfWeek}, ${nepaliDay} ${nepaliDate.bsMonthName} ${nepaliYear} | ${period} ${nepaliHours}:${nepaliMinutes}:${nepaliSeconds}`;
}
