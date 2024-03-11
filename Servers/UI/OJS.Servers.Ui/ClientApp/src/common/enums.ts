enum ThemeMode {
    Light = 'light',
    Dark = 'dark',
}

enum FilterColumnTypeEnum {
    STRING = 'text',
    BOOL = 'boolean',
    NUMBER = 'number',
    DATE = 'date',
    ENUM = 'enum',
}

enum SortingEnum {
    ASC = 'ASC',
    DESC = 'DESC',
}

enum ProblemGroupTypes {
    None = 0,
    ExcludedFromHomework = 1,
}

enum PublicSubmissionState {
    Ready = 1,
    Processing = 2,
    Queued = 3,
}

enum SubmissionStatus {
    All = 1,
    Processing = 2,
    Pending = 3,
}

enum ProblemResourceType
{
    ProblemDescription = 1,
    AuthorsSolution = 2,
    Link = 3,
}

export {
    ThemeMode,
    FilterColumnTypeEnum,
    SortingEnum,
    ProblemGroupTypes,
    ProblemResourceType,
    SubmissionStatus,
    PublicSubmissionState,
};
