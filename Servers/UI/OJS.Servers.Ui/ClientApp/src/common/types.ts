import { ITreeItemType } from '../components/guidelines/trees/Tree';

interface ISubmissionTypeType {
    id: number,
    name: string,
    isSelectedByDefault: boolean,
}

interface IProblemResourceType {
    id: number,
    name: string,
    link: string,
    type: number,
}

interface IProblemType {
    id: number;
    name: string;
    orderBy: number;
    points: number;
    maximumPoints: number;
    isExcludedFromHomework: boolean;
    memoryLimit: number;
    fileSizeLimit: number;
    timeLimit: number;
    checkerName: string;
    checkerDescription: string;
    resources: IProblemResourceType[];
    allowedSubmissionTypes: ISubmissionTypeType[];
}

interface IContestType {
    id: number,
    name: string,
    categoryId: number,
    categoryName: string,
    startTime: Date,
    endTime: Date,
    practiceStartTime: Date,
    practiceEndTime: Date,
    limitBetweenSubmissions: number,
    isDeleted: boolean,
    isVisible: boolean,
    isOnline: boolean,
    allowedSubmissionTypes: ISubmissionTypeType[],
    problems: IProblemType[],
    canBeCompeted: boolean,
    canBePracticed: boolean,
    resultsArePubliclyVisible: boolean,
    hasContestPassword: boolean,
    hasPracticePassword: boolean,
    remainingTimeInMilliseconds: number,
    userIsAdminOrLecturerInContest: boolean,
    userCanCompete: boolean,
    userIsParticipant: false,
    isActive: boolean,
}

interface IIndexContestsType {
    id: number,
    name: string,
    startTime: Date,
    endTime: Date,
    practiceStartTime: Date,
    practiceEndTime: Date,
    canBePracticed: boolean,
    canBeCompeted: boolean,
    hasContestPassword: boolean,
    hasPracticePassword: boolean,
    category: string
}

interface IContestCategoryTreeType extends ITreeItemType {
    nameUrl: string,
}

interface IGetContestsForIndexResponseType {
    activeContests: IIndexContestsType[]
    pastContests: IIndexContestsType[]
}

interface IRegisterForContestResponseType {
    id: number;
    name: string;
    requirePassword: boolean;
}

interface IStartParticipationResponseType {
    contest: IContestType;
    contestIsCompete: boolean;
    lastSubmissionTime: Date,
    remainingTimeInMilliseconds: number
}

interface IPagedResultType<TItem> {
    totalItemsCount: number;
    itemsPerPage: number;
    pagesCount: number;
    pageNumber: number;
    items?: TItem[];
}

interface IUserType {
    username: string;
    permissions: IUserPermissionsType;
    isLoggedIn: boolean;
}

interface IUserPermissionsType {
    canAccessAdministration: boolean,
}

// eslint-disable-next-line import/prefer-default-export
export type {
    IIndexContestsType,
    IGetContestsForIndexResponseType,
    IRegisterForContestResponseType,
    IStartParticipationResponseType,
    IContestType,
    IProblemType,
    IProblemResourceType,
    ISubmissionTypeType,
    IContestCategoryTreeType,
    IPagedResultType,
    IUserType,
    IUserPermissionsType,
};
