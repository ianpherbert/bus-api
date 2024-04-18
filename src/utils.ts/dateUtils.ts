import moment from 'moment';

export enum DateFormat {
    DB = "YYYYMMDD"
}

export function getStringForNow(dateFormat = DateFormat.DB) {
    return formatDate(new Date(), dateFormat)
}

export function parseDate(date: string, dateFormat = DateFormat.DB) {
    return moment.utc(date, "YYYYMMDD").toDate();
}

export function formatDate(date: Date, dateFormat = DateFormat.DB) {
    return moment(date).format(dateFormat);
}

export function weeksFromString(date: string, weeks: number, dateFormat = DateFormat.DB) {
    return moment(date).add(weeks, "weeks").format(dateFormat)
}

export function getDayOfWeek(date: Date) {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const dayNumber = date.getDay();
    return days[dayNumber]
}

export function formatMoreThan24hourClock(timeString: string, date: Date) {
    const [hour, minute] = timeString.split(":").map(Number);
    const moreDays = hour % 24;
    const correctedHour = hour - (24 * moreDays);
    const correctedDate = moment(date).add(moreDays, "days")
        .set("hours", correctedHour)
        .set("minute", minute)


    return correctedDate.toDate()
}