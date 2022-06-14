/* eslint-disable import/prefer-default-export */

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
    IContestStrategyFilter,
};

export {
    ContestType,
    ContestStatus,
    FilterType,
};
