import { CONTESTS_PATH } from './client-urls';

const composeParticipationTypeResultsFullRoute =
    (id: number, participationType: string) => `/${CONTESTS_PATH}/${id}/${participationType}/results/full`;

const composeContestsWithSelectedCategoryAndStrategyUrl =
    (categoryId?: number, strategyId?: number) => `/${CONTESTS_PATH}?category=${categoryId}&strategy=${strategyId}`;

const composeContestBreadcrumbUrl = (breadcrumbItemId: number) => `/${CONTESTS_PATH}?category=${breadcrumbItemId}`;

const composeContestParticipateUrl = (isCompete: boolean, id: number) => {
    if (isCompete) {
        return `/${CONTESTS_PATH}/${id}/compete`;
    }
    return `/${CONTESTS_PATH}/${id}/practice`;
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
