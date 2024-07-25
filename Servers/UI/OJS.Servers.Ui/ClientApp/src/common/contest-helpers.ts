import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { ContestParticipationType } from './constants';
import { IIndexContestsType } from './types';

const contestParticipationType =
    (isOfficial: boolean) => isOfficial
        ? ContestParticipationType.Compete
        : ContestParticipationType.Practice;

const getCompeteResultsAreVisible = (
    contest: IIndexContestsType,
    loggedInUserCanAccessAdministration: boolean,
) => (loggedInUserCanAccessAdministration ||
    (contest.canBeCompeted && !isNil(contest.userParticipationResult?.competePoints))) &&
    contest.competeResults > 0;

const getPracticeResultsAreVisible = (
    contest: IIndexContestsType,
    loggedInUserCanAccessAdministration: boolean,
) => (loggedInUserCanAccessAdministration || (!loggedInUserCanAccessAdministration && (contest.canBeCompeted || contest.canBePracticed))) &&
    contest.practiceResults > 0;

const createUrlFriendlyPath = (inputString: string | undefined | null): string => {
    let resultString = '';
    let isLastCharacterDash = false;

    const cleanedString = inputString
        ? inputString
            .replace(/C#/g, 'CSharp')
            .replace(/C\+\+/g, 'CPlusPlus')
            .toLowerCase()
        : '';

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < cleanedString.length; i++) {
        const character = cleanedString[i];
        if (/[\p{L}\p{Nd}]/u.test(character)) {
            resultString += character;
            isLastCharacterDash = false;
        } else if (!isLastCharacterDash) {
            resultString += '-';
            isLastCharacterDash = true;
        }
    }

    const result = resultString.replace(/^-+|-+$/g, '');
    return isEmpty(result)
        ? ''
        : `/${result}`;
};

export {
    contestParticipationType,
    getCompeteResultsAreVisible,
    getPracticeResultsAreVisible,
    createUrlFriendlyPath,
};
