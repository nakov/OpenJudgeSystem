import { ContestParticipationType } from './constants';

export const canCompeteContest =
    (participationType: ContestParticipationType) => participationType === ContestParticipationType.Compete ||
        participationType === ContestParticipationType.Practice;

export default { canCompeteContest };
