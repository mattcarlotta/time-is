export function getTime(date: Date, showAMPM: boolean, showSeconds: boolean): (number | string)[] {
    const hours = date.getHours() - (date.getHours() > 12 && showAMPM ? 12 : 0);
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const time = [
        Math.floor(hours / 10),
        hours % 10,
        ":",
        Math.floor(minutes / 10),
        minutes % 10,
        ":",
        Math.floor(seconds / 10),
        seconds % 10
    ];

    return showSeconds ? time : time.slice(0, -3);
}

export function formatAsDayWithOrdinal(d: number) {
    let ordinal = "";
    if (d > 3 && d < 21) ordinal = "th";
    if (!ordinal) {
        switch (d % 10) {
            case 1:
                ordinal = "st";
                break;
            case 2:
                ordinal = "nd";
                break;
            case 3:
                ordinal = "rd";
                break;
            default:
                ordinal = "th";
                break;
        }
    }

    return `${d}${ordinal}`;
}

const weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export function formatAsLongWeekDay(d: number) {
    return weekDay[d];
}

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
] as const;

export function formatAsLongMonth(m: number) {
    return months[m];
}
