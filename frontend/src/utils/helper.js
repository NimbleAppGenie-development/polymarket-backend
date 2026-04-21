import moment from "moment";
const staticBaseUrl = import.meta.env.VITE_IMAGE_URL;

const dateFormats = {
    // ISO formats
    timestamp: "YYYY-MM-DDTHH:mm:ssZ",
    iso: "YYYY-MM-DD",
    isoDateTime: "YYYY-MM-DDTHH:mm:ss",
    perfectDateTime: "DD-MM-YYYY hh:mm A",
    isoTime: "HH:mm:ss",

    // US formats
    shortDate: "MM/DD/YYYY",
    shortDateTime: "MM/DD/YYYY HH:mm",
    shortTime: "h:mm A",

    // European formats
    euDate: "DD/MM/YYYY",
    euDateTime: "DD/MM/YYYY HH:mm",

    // Human readable
    longDate: "MMMM D, YYYY",
    longDateTime: "MMMM D, YYYY h:mm A",
    monthYear: "MMMM YYYY",
    shortMonthYear: "MMM YYYY",
    dayMonth: "D MMMM",

    // Special formats
    slashDate: "YYYY/MM/DD",
    dashDate: "YYYY-MM-DD",
    dotDate: "DD.MM.YYYY",

    // Database friendly
    sortableDate: "YYYYMMDD",
    sortableDateTime: "YYYYMMDDHHmmss",
};

/**
 * @param date
 * @param format
 * @returns {string}
 */
export function dateFormatter(date, format) {
    return moment(date).format(dateFormats[format]);
}

export function fetchURLfromBackend(path) {
    return `${staticBaseUrl}/public${path}`;
}
