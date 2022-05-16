import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { convertToTwoDigitValues, secondsToFullTime } from '../../../utils/dates';

enum Metric {
    seconds = 1,
    minutes = 2,
    hours = 3,
    days = 4,
}

interface ICountdownRemainingType {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

interface ICountdownProps {
    duration: number;
    metric: Metric;
    renderRemainingTime?: (countdownRemaining: ICountdownRemainingType) => React.ReactElement;
    handleOnCountdownEnd?: () => void;
    handleOnCountdownChange?: (seconds: number) => void;
}

const defaultRender = (remainingTime: ICountdownRemainingType) => {
    const { hours, minutes, seconds } = convertToTwoDigitValues(remainingTime);
    return (
        <>
            <p>
                Remaining time:
                {' '}
                <span>
                    {hours}
                    :
                    {minutes}
                    :
                    {seconds}
                </span>
            </p>
        </>
    );
};

// eslint-disable-next-line max-len
const Countdown = ({ duration, metric, renderRemainingTime = defaultRender, handleOnCountdownEnd = () => {}, handleOnCountdownChange = () => {} }: ICountdownProps) => {
    const metricsToSecondsDelta = useMemo(() => ({
        [Metric.seconds]: 1,
        [Metric.minutes]: 60,
        [Metric.hours]: 60 * 60,
        [Metric.days]: 24 * 60 * 60,
    }), []);

    const [ remainingInSeconds, setRemainingInSeconds ] = useState(0);

    useEffect(() => {
        setRemainingInSeconds(duration * metricsToSecondsDelta[metric]);
    }, [ duration, metric, metricsToSecondsDelta ]);

    const decreaseRemainingTime = useCallback(
        () => setRemainingInSeconds(remainingInSeconds - 1),
        [ remainingInSeconds ],
    );

    useEffect(() => {
        if (remainingInSeconds < 0) {
            handleOnCountdownEnd();
            return () => {};
        }

        const timer = setTimeout(decreaseRemainingTime, 1000);

        return () => clearTimeout(timer);
    }, [ decreaseRemainingTime, handleOnCountdownEnd, remainingInSeconds ]);

    useEffect(() => {
        handleOnCountdownChange(remainingInSeconds);
    }, [ handleOnCountdownChange, remainingInSeconds ]);

    return (
        <>
            {renderRemainingTime(secondsToFullTime(remainingInSeconds))}
        </>
    );
};

export default Countdown;

export {
    Metric,
};

export type {
    ICountdownRemainingType,
};
