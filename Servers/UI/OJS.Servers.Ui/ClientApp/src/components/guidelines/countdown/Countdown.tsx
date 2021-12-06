import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { secondsToFullTime } from '../../../utils/dates';

interface ICountdownRemainingType {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

interface ICountdownProps {
    duration: number;
    metric: 'seconds' | 'minutes' | 'hours' | 'days';
    renderRemainingTime?: (countdownRemaining: ICountdownRemainingType) => React.ReactElement;
    handleOnCountdownEnd: () => void;
    handleOnCountdownChange: (seconds: number) => void;
}

const defaultRender = (countdownRemaining: ICountdownRemainingType) => (
    <>
        {JSON.stringify(countdownRemaining)}
    </>
);

// eslint-disable-next-line max-len
const Countdown = ({ duration, metric, renderRemainingTime = defaultRender, handleOnCountdownEnd, handleOnCountdownChange }: ICountdownProps) => {
    const metricsToSecondsDelta = useMemo(() => ({
        seconds: 1,
        minutes: 60,
        hours: 60 * 60,
        days: 24 * 60 * 60,
    }), []);

    const [ remainingInSeconds, setRemainingInSeconds ] = useState(0);

    useEffect(() => {
        setRemainingInSeconds(duration * metricsToSecondsDelta[metric]);
    }, [ duration, metric, metricsToSecondsDelta ]);

    useEffect(() => {
        if (remainingInSeconds < 0) {
            handleOnCountdownEnd();
            return () => {};
        }

        const timer = setTimeout(() => setRemainingInSeconds(remainingInSeconds - 1), 1000);

        return () => clearTimeout(timer);
    }, [ handleOnCountdownEnd, remainingInSeconds ]);

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

export type {
    ICountdownRemainingType,
};
