/* eslint-disable import/prefer-default-export */

enum FilterType {
    Status = 'Status',
    Strategy = 'Strategy',
    Category = 'Category',
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
    usageOrder: boolean;
}

enum ContestType {
    Practice = 0,
    Compete = 1,
}

enum ContestState {
    Active = 'active',
    Past = 'past',
}

export type {
    IFilter,
    IContestStrategyFilter,
};

export {
    ContestType,
    ContestState,
    FilterType,
};
