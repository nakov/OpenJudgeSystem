import { ContestStatus, FilterType, SortType } from './contest-types';

const DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE = 4;
const { Status: DEFAULT_FILTER_TYPE } = FilterType;
const { All: DEFAULT_STATUS_FILTER_TYPE } = ContestStatus;
const { Sort: DEFAULT_SORT_FILTER_TYPE } = FilterType;
const { StartDate: DEFAULT_SORT_TYPE } = SortType;

enum SubmissionResultType {
    CorrectAnswer = 'correctanswer',
    WrongAnswer = 'wronganswer',
}

enum ContestParticipationType {
    Compete = 'compete',
    Practice = 'practice',
}

enum ContestResultType {
    Simple = 'simple',
    Full = 'full',
}

export {
    DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE,
    DEFAULT_FILTER_TYPE,
    DEFAULT_STATUS_FILTER_TYPE,
    DEFAULT_SORT_FILTER_TYPE,
    DEFAULT_SORT_TYPE,
    SubmissionResultType,
    ContestParticipationType,
    ContestResultType,
};
