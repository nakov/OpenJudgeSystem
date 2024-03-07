type ToggleParam = (param: IFilter | ISort) => void;

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

enum ContestType {
    Practice = 0,
    Compete = 1,
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
    ToggleParam,
    ContestBreadcrumb,
};

export {
    ContestType,
    ContestStatus,
    FilterType,
    SortType,
    ContestVariation,
};
