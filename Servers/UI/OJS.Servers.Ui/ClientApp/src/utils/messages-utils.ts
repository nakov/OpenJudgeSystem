/* eslint-disable valid-typeof */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';

import { ExceptionData } from '../common/types';

const getAndSetExceptionMessage = (exceptions: Array<unknown>, setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    const messages = extractMessages(exceptions);
    setState(messages);
};

const getAndSetSuccesfullMessages = (data: Array<any>) => {
    const filteredData = data.filter((x) => x !== undefined);
    const message = filteredData[0] as string;
    if (message) {
        return message;
    }
    return null;
};

const extractMessages = (error: Array<unknown>): Array<string> => {
    const filteredErrors = error.filter((x) => x !== undefined);

    let currentError = [] as Array<ExceptionData>;
    if (filteredErrors.length > 0) {
        currentError = filteredErrors[0] as Array<ExceptionData>;
    }
    if (currentError.length > 0) {
        return currentError.map((x) => x.message);
    }
    return [];
};

export {
    getAndSetExceptionMessage,
    getAndSetSuccesfullMessages,
};
