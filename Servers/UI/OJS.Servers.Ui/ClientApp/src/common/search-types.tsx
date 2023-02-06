enum SearchParams {
    search = 'searchterm'
}

interface IContestSearchType{
    id: number;
    name: string;
    startTime: Date;
    endTime: Date;
    practiceStartTime: Date;
    practiceEndTime: Date;
    canBePracticed: boolean;
    canBeCompeted: boolean;
    hasContestPassword: boolean;
    hasPracticePassword: boolean;
    category: string;
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
