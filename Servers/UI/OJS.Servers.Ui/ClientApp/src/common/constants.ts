import { ContestStatus, FilterType, SortType } from './contest-types';

const FileValidationError = 'Invalid file extension.';
const PAGE_SIBLING_COUNT = 2;
const PAGE_BOUNDARY_COUNT = 0;

const ExcludedFromHomeWorkTaskHeadingAddition = '(not included in final score)';
const { Status: DEFAULT_FILTER_TYPE } = FilterType;
const { All: DEFAULT_STATUS_FILTER_TYPE } = ContestStatus;
const { Sort: DEFAULT_SORT_FILTER_TYPE } = FilterType;
const { OrderBy: DEFAULT_SORT_TYPE } = SortType;

const defaultPathIdentifier = 'api';
enum SubmissionResultType {
    CorrectAnswer = 'correctanswer',
    WrongAnswer = 'wronganswer',
    TimeLimit = 'timelimit',
    MemoryLimit = 'memorylimit',
    RunTimeError = 'runtimeerror',
}

enum ContestParticipationType {
    Compete = 'compete',
    Practice = 'practice',
}

enum ContestResultType {
    Simple = 'simple',
    Full = 'full',
}

enum FileType {
    Blob = 'blob',
}

export {
    ExcludedFromHomeWorkTaskHeadingAddition,
    DEFAULT_FILTER_TYPE,
    DEFAULT_STATUS_FILTER_TYPE,
    DEFAULT_SORT_FILTER_TYPE,
    DEFAULT_SORT_TYPE,
    SubmissionResultType,
    ContestParticipationType,
    ContestResultType,
    FileType,
    FileValidationError,
    PAGE_SIBLING_COUNT,
    PAGE_BOUNDARY_COUNT,
    defaultPathIdentifier,
};
