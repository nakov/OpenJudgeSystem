import { CONTESTS_PATH } from './client-urls';

const composeParticipationTypeResultsFullRoute =
    (id: number, participationType: string) => `/${CONTESTS_PATH}/${id}/${participationType}/results/full`;

const composeContestsWithSelectedCategoryAndStrategyUrl =
    (categoryId?: number, strategyId?: number) => `/contests?category=${categoryId}&strategy=${strategyId}`;

const composeContestBreadcrumbUrl = (breadcrumbItemId: number) => `/contests?category=${breadcrumbItemId}`;

const composeContestParticipateUrl = (isCompete: boolean, id: number) => {
    if (isCompete) {
        return `/contests/${id}/compete`;
    }
    return `/contests/${id}/practice`;
};

const composeContestResultsUrl = (isCompete: boolean, isSimple: boolean, id: number) => `/contests/${id}/${isCompete
    ? 'compete'
    : 'practice'}/results/${isSimple
    ? 'simple'
    : 'full'}`;

export {
    composeParticipationTypeResultsFullRoute,
    composeContestsWithSelectedCategoryAndStrategyUrl,
    composeContestBreadcrumbUrl,
    composeContestParticipateUrl,
    composeContestResultsUrl,
};
