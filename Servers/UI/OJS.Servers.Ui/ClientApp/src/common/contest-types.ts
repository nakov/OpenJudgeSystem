/* eslint-disable import/prefer-default-export */

type ToggleParam = (param: IFilter | ISort) => void;

interface IContestQueryParam {
    name: string;
    value: string;
    id: number;
    type: any;
}

enum FilterType {
    Status = 'Status',
    Strategy = 'Strategy',
    Category = 'Category',
}

type FilterInfo = {
    name: string;
    value: string;
}

interface IFilter extends IContestQueryParam {
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

interface ISort extends IContestQueryParam {
    type: SortType;
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
    IContestQueryParam,
};

export {
    ContestType,
    ContestStatus,
    FilterType,
    SortType,
};
