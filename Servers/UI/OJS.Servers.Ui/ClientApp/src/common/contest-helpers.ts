import { ContestParticipationType } from './constants';

const isParticipationTypeValid =
    (participationType: ContestParticipationType) => participationType === ContestParticipationType.Compete ||
        participationType === ContestParticipationType.Practice;

const contestParticipationType =
    (isOfficial: boolean) => isOfficial
        ? ContestParticipationType.Compete
        : ContestParticipationType.Practice;

export { isParticipationTypeValid, contestParticipationType };
