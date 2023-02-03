enum SearchParams {
    search = 'searchterm'
}

interface IContestSearchType{
    id: number;
    name: string;
}

interface IProblemContest {
    id: number;
    name: string;
    canBeCompeted: boolean;
    canBePracticed: boolean;
}

interface IProblemSearchType {
    id: number;
    name: string;
    contest: IProblemContest;
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
