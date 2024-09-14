enum FilterType {
    Status = 'Status',
    Strategy = 'Strategy',
    Category = 'Category',
    Sort = 'SortType'
}

enum SortType {
    Name = 'Name',
    StartDate = 'StartDate',
    EndDate = 'EndDate',
    OrderBy = 'OrderBy',
    ParticipantRegistrationTime = 'ParticipantRegistrationTime',
}

enum SortTypeDirection {
    Ascending = 'Ascending',
    Descending = 'Descending',
}

type SortInfo = {
    name: string;
    value: string;
}

type ContestBreadcrumb = {
    name: string;
    id: number;
}

interface IContestStrategyFilter {
    name: string;
    id: number;
}

enum ContestVariation {
    Exercise = 0,
    OnsitePracticalExam = 1,
    OnlinePracticalExam = 2,
    Lab = 3,
}

export type {
    SortInfo,
    IContestStrategyFilter,
    ContestBreadcrumb,
};

export {
    FilterType,
    SortType,
    SortTypeDirection,
    ContestVariation,
};
