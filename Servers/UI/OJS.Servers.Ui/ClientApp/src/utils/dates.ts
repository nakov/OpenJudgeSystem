import { intervalToDuration } from 'date-fns';
import moment from 'moment';

const defaultDateTimeFormat = 'HH:MM, DD/MMM/yyyy';

const calculateTimeUntil = (date: Date) => intervalToDuration({
    start: new Date(),
    end: date,
});

const formatDate = (
    date: Date,
    formatString = defaultDateTimeFormat,
) => (moment().diff(new Date(date), 'days') > 3
    ? moment(date).format(formatString)
    : moment.utc(date).fromNow());

const convertToSecondsRemaining = (date: Date) => {
    const { days, hours, minutes, seconds } = intervalToDuration({
        start: new Date(),
        end: date,
    });

    const daysRemaining = days ?? 0;

    const hoursRemaining = daysRemaining * 24 + (hours ?? 0);
    const minutesRemaining = hoursRemaining * 60 + (minutes ?? 0);

    return minutesRemaining * 60 + (seconds ?? 0);
};

const secondsToFullTime = (duration: number) => {
    const { days: daysInitial, hours: hoursInitial, minutes: minutesInitial, seconds: secondsInitial } =
        intervalToDuration({ start: 0, end: duration * 1000 });

    const days = daysInitial ?? 0;

    const hours = hoursInitial ?? 0;

    const minutes = minutesInitial ?? 0;

    const seconds = secondsInitial ?? 0;

    return { days, hours, minutes, seconds };
};

interface IConvertToTwoDigitValuesParamType {
    hours: number;
    minutes: number;
    seconds: number
}

const convertToTwoDigitValues = ({
    hours: hoursValue,
    minutes: minutesValue,
    seconds: secondsValue,
}: IConvertToTwoDigitValuesParamType) => {
    const hours = hoursValue >= 10
        ? hoursValue.toString()
        : `0${hoursValue}`;

    const minutes = minutesValue >= 10
        ? minutesValue.toString()
        : `0${minutesValue}`;

    const seconds = secondsValue >= 10
        ? secondsValue.toString()
        : `0${secondsValue}`;

    return {
        hours,
        minutes,
        seconds,
    };
};

export default {
    formatDate,
    secondsToFullTime,
    calculateTimeUntil,
    convertToSecondsRemaining,
    convertToTwoDigitValues,
};

export {
    formatDate,
    secondsToFullTime,
    calculateTimeUntil,
    convertToSecondsRemaining,
    convertToTwoDigitValues,
};
