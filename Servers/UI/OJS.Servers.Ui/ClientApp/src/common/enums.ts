enum FilterColumnTypeEnum {
    STRING = 'text',
    BOOL = 'boolean',
    NUMBER = 'number',
    DATE = 'date',
}

enum SortingEnum {
    ASC = 'ASC',
    DESC = 'DESC',
}

enum ProblemGroupTypes {
    None = 0,
    ExcludedFromHomework = 1,
}

enum ProblemResourceType
{
    ProblemDescription = 1,
    AuthorsSolution = 2,
    Link = 3,
}

export {
    FilterColumnTypeEnum,
    SortingEnum,
    ProblemGroupTypes,
    ProblemResourceType,
};
