enum SearchParams {
    search = 'searchTerm'
}

interface IContestSearchType{
    id: number;
    name: string;
}

interface IProblemSearchType {
    id: number;
    name: string;
}

interface IUserSearchType {
    id: string;
    name: string;
}

export {
    SearchParams,
};

export type {
    IContestSearchType,
    IProblemSearchType,
    IUserSearchType,
};
