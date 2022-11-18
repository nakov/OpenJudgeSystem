import { ContestStatus, FilterType, SortType } from './contest-types';

const DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE = 4;

const DEFAULT_FILTER_TYPE = FilterType.Status;
const DEFAULT_STATUS_FILTER_TYPE = ContestStatus.All;

const DEFAULT_SORT_FILTER_TYPE = FilterType.Sort;
const DEFAULT_SORT_TYPE = SortType.StartDate;

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
