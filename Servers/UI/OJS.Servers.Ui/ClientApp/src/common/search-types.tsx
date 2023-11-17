enum SearchParams {
    search = 'searchTerm',
}

enum SearchCategory {
    User = 'Users',
    Contest = 'Contests',
    Problem = 'Problems'
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
    isLoading: boolean;
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
    SearchCategory,
};

export type {
    IContestSearchType,
    IProblemSearchType,
    IUserSearchType,
};
