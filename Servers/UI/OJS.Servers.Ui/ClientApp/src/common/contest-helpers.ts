import isNil from 'lodash/isNil';

import { ContestParticipationType } from './constants';
import { IIndexContestsType } from './types';

const isParticipationTypeValid =
    (participationType: ContestParticipationType) => participationType === ContestParticipationType.Compete ||
        participationType === ContestParticipationType.Practice;

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

export { isParticipationTypeValid,
    contestParticipationType,
    getCompeteResultsAreVisible,
    getPracticeResultsAreVisible };
