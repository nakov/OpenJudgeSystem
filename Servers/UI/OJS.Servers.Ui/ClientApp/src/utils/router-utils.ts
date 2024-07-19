import { json } from 'react-router-dom';

import { ContestParticipationType, ContestResultType } from '../common/constants';

const isIntegerParam = (param: string | undefined) => param && /^\d+$/.test(param.trim());

const isParticipationTypeValid = (participationType: string | undefined) => participationType === ContestParticipationType.Compete ||
        participationType === ContestParticipationType.Practice;

const isResultTypeValid = (resultType: string | undefined) => resultType === ContestResultType.Simple ||
    resultType === ContestResultType.Full;

const toIsoString = (text: string | undefined) => text
    ? encodeURI(text)
    : '';

const validateIntegerParam = (param: string | undefined) => {
    if (!isIntegerParam(param)) {
        throw json(null, { status: 404, statusText: `${toIsoString(param)} is not a valid integer` });
    }
};

const validateParticipationType = (participationType: string | undefined) => {
    if (!isParticipationTypeValid(participationType)) {
        throw json(null, { status: 404, statusText: `${toIsoString(participationType)} is not a valid participation type` });
    }
};

const validateResultType = (resultType: string | undefined) => {
    if (!isResultTypeValid(resultType)) {
        throw json(null, { status: 404, statusText: `${toIsoString(resultType)} is not a valid result type` });
    }
};

export {
    validateIntegerParam,
    validateParticipationType,
    validateResultType,
};
