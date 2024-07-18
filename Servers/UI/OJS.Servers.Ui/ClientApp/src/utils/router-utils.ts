import { json } from 'react-router-dom';

import { ContestParticipationType, ContestResultType } from '../common/constants';

const isIntegerParam = (param: string | undefined) => param && /^\d+$/.test(param.trim());

const isParticipationTypeValid = (participationType: string | undefined) => participationType === ContestParticipationType.Compete ||
        participationType === ContestParticipationType.Practice;

const isResultTypeValid = (resultType: string | undefined) => resultType === ContestResultType.Simple ||
    resultType === ContestResultType.Full;

const validateIntegerParam = (param: string | undefined) => {
    if (!isIntegerParam(param)) {
        throw json({ message: `${param} is not a valid integer`, status: 404 });
    }
};

const validateParticipationType = (participationType: string | undefined) => {
    if (!isParticipationTypeValid(participationType)) {
        throw json({ message: `${participationType} is not a valid participation type`, status: 404 });
    }
};

const validateResultType = (resultType: string | undefined) => {
    if (!isResultTypeValid(resultType)) {
        throw json({ message: `${resultType} is not a valid result type`, status: 404 });
    }
};

export {
    validateIntegerParam,
    validateParticipationType,
    validateResultType,
};
