/* eslint-disable import/prefer-default-export */

enum FilterType {
    Status = 'Status',
    Strategy = 'Execution Strategy',
}

interface IFilter {
    name: string;
    id: number;
    type: FilterType;
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
};

export {
    ContestType,
    ContestState,
    FilterType,
};
