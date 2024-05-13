import { ContestStatus, FilterType, SortType } from './contest-types';

const FileValidationError = 'Invalid file extension.';
const PAGE_SIBLING_COUNT = 2;
const PAGE_BOUNDARY_COUNT = 0;

const ExcludedFromHomeWorkTaskHeadingAddition = '(not included in final score)';
const NotSelectedSearchCategoryMessage = 'No search category has been selected.';
const DefaultLoginErrorMessage = 'Invalid username or password.';
const EmptyLoginFormErrorMessage = 'Username and password are required.';
const EmptyUsernameErrorMessage = 'Username is required.';
const UsernameLengthErrorMessage = 'The username must be between 5 and 32 characters long.';
const UsernameFormatErrorMessage = 'The username can contain only Latin letters, numbers, and the symbols \'.\' or \'_\'. ' +
    'The username must start with a letter and end with a letter or a number.';
const EmptyPasswordErrorMessage = 'Please enter your password.';
const PasswordLengthErrorMessage = 'The password must be at least 6 characters long.';
const { Status: DEFAULT_FILTER_TYPE } = FilterType;
const { All: DEFAULT_STATUS_FILTER_TYPE } = ContestStatus;
const { Sort: DEFAULT_SORT_FILTER_TYPE } = FilterType;
const { OrderBy: DEFAULT_SORT_TYPE } = SortType;

const LECTURER = 'Lecturer';
const defaultPathIdentifier = 'api';

enum TestRunResultType {
    CorrectAnswer = 'CorrectAnswer',
    WrongAnswer = 'WrongAnswer',
    TimeLimit = 'TimeLimit',
    MemoryLimit = 'MemoryLimit',
    RunTimeError = 'RunTimeError',
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
    NotSelectedSearchCategoryMessage,
    DEFAULT_STATUS_FILTER_TYPE,
    DEFAULT_SORT_FILTER_TYPE,
    DEFAULT_SORT_TYPE,
    TestRunResultType,
    ContestParticipationType,
    ContestResultType,
    FileType,
    FileValidationError,
    PAGE_SIBLING_COUNT,
    PAGE_BOUNDARY_COUNT,
    defaultPathIdentifier,
    DefaultLoginErrorMessage,
    EmptyLoginFormErrorMessage,
    EmptyUsernameErrorMessage,
    UsernameLengthErrorMessage,
    UsernameFormatErrorMessage,
    EmptyPasswordErrorMessage,
    PasswordLengthErrorMessage,
    LECTURER,
};
