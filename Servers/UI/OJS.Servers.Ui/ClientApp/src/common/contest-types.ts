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

type FilterSortType = FilterType | SortType;

type FilterInfo = {
    name: string;
    value: string;
}

type SortInfo = {
    name: string;
    value: string;
}

type ContestBreadcrumb = {
    name: string;
    id: number;
}

interface IContestParam<T> {
    name: string;
    value: string;
    id: number;
    type: T;
}

type IFilter = IContestParam<FilterSortType>

type ISort = IContestParam<FilterSortType>

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

enum ContestStatus {
    All = 'All',
    Active = 'Active',
    Past = 'Past',
    Upcoming = 'Upcoming',
    Practice = 'Practice',
}

export type {
    IContestParam,
    IFilter,
    ISort,
    FilterInfo,
    SortInfo,
    FilterSortType,
    IContestStrategyFilter,
    ContestBreadcrumb,
};

export {
    ContestStatus,
    FilterType,
    SortType,
    SortTypeDirection,
    ContestVariation,
};
