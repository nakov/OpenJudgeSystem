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

type ContestBreadcrumb = {
    name: string;
    id: number;
    allowMentor: boolean;
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
    IContestStrategyFilter,
    ContestBreadcrumb,
};

export {
    SortType,
    SortTypeDirection,
    ContestVariation,
};
