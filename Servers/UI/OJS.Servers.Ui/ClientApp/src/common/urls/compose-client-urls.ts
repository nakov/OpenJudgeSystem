import {
    IAllContestsPageUrlParams,
    IContestsDetailsPageUrlParams,
    IContestsRegisterPageUrlParams,
    IContestsResultsPageUrlParams,
    IContestsSolutionSubmitPageUrlParams,
} from '../app-url-types';
import { ContestParticipationType, ContestResultType } from '../constants';
import { createUrlFriendlyString } from '../contest-helpers';

import { CONTESTS_PATH } from './client-urls';

const getContestsResultsPageUrl = ({
    slug,
    contestId,
    participationType,
    isSimple,
}: IContestsResultsPageUrlParams) => `/contests/${createUrlFriendlyString(slug)}/${contestId}/${participationType}/results/${isSimple
    ? ContestResultType.Simple
    : ContestResultType.Full}`;

const getAllContestsPageUrl = ({
    categoryName,
    strategyId,
    categoryId,
} : IAllContestsPageUrlParams) => {
    const returnUrl = `/${CONTESTS_PATH}/${categoryName
        ? `${createUrlFriendlyString(categoryName)}`
        : 'all'}`;
    const prefixes = [ `${categoryId
        ? `category=${categoryId}`
        : ''}`, `${strategyId
        ? `strategy=${strategyId}`
        : ''}` ];
    const composedString = prefixes.filter((prefix) => prefix).join('&');
    if (composedString.length > 0) {
        return `${returnUrl}?${composedString}`;
    }

    return returnUrl;
};

const getContestsSolutionSubmitPageUrl = ({
    isCompete,
    contestId,
    contestName,
    problemId,
}: IContestsSolutionSubmitPageUrlParams) => `/${CONTESTS_PATH}/${createUrlFriendlyString(contestName)}/${contestId}/${isCompete
    ? ContestParticipationType.Compete
    : ContestParticipationType.Practice}${problemId
    ? `#${problemId}`
    : ''}`;

const getContestsDetailsPageUrl = ({
    contestId,
    contestName,
}: IContestsDetailsPageUrlParams) => `/contests/${createUrlFriendlyString(contestName)}/${contestId}`;

const getContestsRegisterPageUrl = ({
    isCompete,
    contestId,
    contestName,
}: IContestsRegisterPageUrlParams) => `/contests/${createUrlFriendlyString(contestName)}/${contestId}/${isCompete
    ? ContestParticipationType.Compete
    : ContestParticipationType.Practice}/register`;

export {
    getContestsResultsPageUrl,
    getAllContestsPageUrl,
    getContestsSolutionSubmitPageUrl,
    getContestsDetailsPageUrl,
    getContestsRegisterPageUrl,
};
