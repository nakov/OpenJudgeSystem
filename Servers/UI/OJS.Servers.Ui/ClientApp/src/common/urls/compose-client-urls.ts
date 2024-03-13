import { CONTESTS_PATH } from './client-urls';

const composeParticipationTypeResultsFullRoute =
    (id: number, participationType: string, isSimple: boolean) => `/${CONTESTS_PATH}/${id}/${participationType}/results/${isSimple
        ? 'simple'
        : 'full'}`;

const composeContestsWithSelectedCategoryAndStrategyUrl =
    (categoryId?: number, strategyId?: number) => {
        const returnUrl = `/${CONTESTS_PATH}`;
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

const composeContestParticipateUrl = (isCompete: boolean, id: number) => {
    if (isCompete) {
        return `/${CONTESTS_PATH}/${id}/compete`;
    }
    return `/${CONTESTS_PATH}/${id}/practice`;
};

export {
    composeParticipationTypeResultsFullRoute,
    composeContestsWithSelectedCategoryAndStrategyUrl,
    composeContestParticipateUrl,
};
