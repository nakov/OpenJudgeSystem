import { ContestParticipationType } from './constants';

export const isParticipationTypeValid =
    (participationType: ContestParticipationType) => participationType === ContestParticipationType.Compete ||
        participationType === ContestParticipationType.Practice;

export default { isParticipationTypeValid };
