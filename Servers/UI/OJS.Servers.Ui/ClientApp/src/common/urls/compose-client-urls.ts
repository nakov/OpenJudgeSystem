import { createUrlFriendlyString } from '../contest-helpers';

import { CONTESTS_PATH } from './client-urls';

const getContestsResultsUrl =
    (id: number, participationType: string, isSimple: boolean) => `/${CONTESTS_PATH}/${id}/${participationType}/results/${isSimple
        ? 'simple'
        : 'full'}`;

const getAllContestsUrl =
    (categoryId?: number, strategyId?: number, categoryName?: string) => {
        const returnUrl = `/${CONTESTS_PATH}/${categoryName
            ? `${createUrlFriendlyString(categoryName)}`
            : 'all-contests'}`;
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

const getContestSubmissionPageUrl = (isCompete: boolean, id: number, problemId?: number) => {
    if (isCompete) {
        return `/${CONTESTS_PATH}/${id}/compete${problemId
            ? `#${problemId}`
            : ''}`;
    }
    return `/${CONTESTS_PATH}/${id}/practice${problemId
        ? `#${problemId}`
        : ''}`;
};

export {
    getContestsResultsUrl,
    getAllContestsUrl,
    getContestSubmissionPageUrl,
};
