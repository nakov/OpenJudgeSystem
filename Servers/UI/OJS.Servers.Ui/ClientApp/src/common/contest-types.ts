/* eslint-disable import/prefer-default-export */

type ToggleParam = (param: IFilter | ISort) => void;

enum FilterType {
    Status = 'Status',
    Strategy = 'Strategy',
    Category = 'Category',
}

type FilterInfo = {
    name: string;
    value: string;
}

interface IFilter {
    name: string;
    value: string;
    id: number;
    type: FilterType;
}

enum SortType {
    Name = 'Name',
    StartDate = 'StartDate',
    EndDate = 'EndDate',
}

type SortInfo = {
    name: string;
    value: string;
}

interface ISort {
    name: string;
    value: string;
    id: number;
    type: string;
}

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
