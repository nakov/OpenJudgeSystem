import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const ADMIN_DEFAULT_DATE_AND_TIME_FORMAT = 'DD.MM.YYYY, HH:mm';
const ADMIN_PRECISE_DATE_AND_TIME_FORMAT = 'DD.MM.yyyy, HH:mm:ss:SSS';

const convertToUtc = (date?: Date | null | undefined) => {
    if (!date) {
        return null;
    }

    return new Date(dayjs.utc(date).toISOString());
};

const getDateAsLocal = (date?: string | number | Date | null | undefined) => {
    if (!date) {
        return null;
    }

    return dayjs.utc(date).local();
};

const adminFormatDate = (date?: Date | null | undefined, format?: string | null | undefined) => {
    if (!date) {
        return null;
    }

    return getDateAsLocal(date)!.format(format || ADMIN_DEFAULT_DATE_AND_TIME_FORMAT);
};

const adminPreciseFormatDate = (date?: Date | null | undefined) => adminFormatDate(date, ADMIN_PRECISE_DATE_AND_TIME_FORMAT);

export {
    convertToUtc,
    adminFormatDate,
    adminPreciseFormatDate,
    getDateAsLocal,
};
