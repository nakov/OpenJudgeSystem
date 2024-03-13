import { CONTESTS_PATH } from './client-urls';

const getContestsResultsUrl =
    (id: number, participationType: string, isSimple: boolean) => `/${CONTESTS_PATH}/${id}/${participationType}/results/${isSimple
        ? 'simple'
        : 'full'}`;

const getAllContestsUrl =
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

const getContestSubmissionPageUrl = (isCompete: boolean, id: number) => {
    if (isCompete) {
        return `/${CONTESTS_PATH}/${id}/compete`;
    }
    return `/${CONTESTS_PATH}/${id}/practice`;
};

export {
    getContestsResultsUrl,
    getAllContestsUrl,
    getContestSubmissionPageUrl,
};
