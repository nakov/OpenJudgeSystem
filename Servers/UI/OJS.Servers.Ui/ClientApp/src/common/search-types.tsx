enum SearchParams {
    search = 'searchTerm',
    selectedTerm = 'selectedTerm',
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
    category: string;
}

interface IProblemSearchType {
    id: number;
    name: string;
    orderBy: number;
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
