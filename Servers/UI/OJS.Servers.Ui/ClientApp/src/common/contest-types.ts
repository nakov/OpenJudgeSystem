/* eslint-disable import/prefer-default-export */

type ToggleParam = (param: IFilter | ISort) => void;

enum FilterType {
    Status = 'Status',
    Strategy = 'Strategy',
    Category = 'Category',
    Sort = 'SortType'
}

type FilterInfo = {
    name: string;
    value: string;
}

interface IContestParam<T> {
    name: string;
    value: string;
    id: number;
    type: T;
}

enum SortType {
    Name = 'Name',
    StartDate = 'StartDate',
    EndDate = 'EndDate',
}

interface IFilter extends IContestParam<FilterType> {}

type SortInfo = {
    name: string;
    value: string;
}

interface ISort extends IContestParam<SortType> {}

interface IContestStrategyFilter {
    name: string;
    id: number;
}

enum ContestType {
    Practice = 0,
    Compete = 1,
}

enum ContestStatus {
    All = 'all',
    Active = 'active',
    Past = 'past',
}

export type {
    IContestParam,
    IFilter,
    FilterInfo,
    ISort,
    SortInfo,
    IContestStrategyFilter,
    ToggleParam,
};

export {
    ContestType,
    ContestStatus,
    FilterType,
    SortType,
};
