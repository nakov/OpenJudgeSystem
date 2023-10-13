import { PublicSubmissionState } from '../hooks/submissions/use-public-submissions';

import { IContestSearchType, IProblemSearchType, IUserSearchType } from './search-types';

interface ISubmissionTypeType {
    id: number;
    name: string;
    isSelectedByDefault: boolean;
    allowBinaryFilesUpload: boolean;
    allowedFileExtensions: string[];
}

interface IPublicSubmissionContest {
    id: number;
    name: string;
}

interface IPublicSubmissionUser {
    id: string;
    username: string;
}

interface IPublicSubmissionProblem {
    id: number;
    name: string;
    contest: IPublicSubmissionContest;
    orderBy: number;
}

interface IPublicSubmissionResult {
    points: number;
    maxPoints: number;
}

interface ISubmissionResponseModel {
    id: number;
    createdOn: Date;
    strategyName: string;
    user: IPublicSubmissionUser;
    problem: IPublicSubmissionProblem;
    result: IPublicSubmissionResult;
    state: PublicSubmissionState;
    isOfficial: boolean;
}

interface IProblemResourceType {
    id: number;
    name: string;
    link: string;
    type: number;
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

interface IContestDetailsProblemType {
    name: string;
    orderBy: number;
    resources?: IProblemResourceType[];
}

interface IContestDetailsSubmissionType {
    id: number;
    name: string;
}

interface IContestDetailsResponseType {
    id: number;
    name: string;
    description: string;
    problems: IContestDetailsProblemType[];
    canViewResults: boolean;
    isOnlineExam: boolean;
    canBeCompeted: boolean;
    canBePracticed: boolean;
    isAdminOrLecturerInContest: boolean;
    allowedSubmissionTypes: IContestDetailsSubmissionType[];
    competeParticipantsCount: number;
    practiceParticipantsCount: number;
}

interface IContestType {
    id: number;
    name: string;
    categoryId: number;
    categoryName: string;
    startTime: Date;
    endTime: Date;
    practiceStartTime: Date;
    practiceEndTime: Date;
    limitBetweenSubmissions: number;
    isDeleted: boolean;
    isVisible: boolean;
    isOnline: boolean;
    isExam: boolean;
    allowedSubmissionTypes: ISubmissionTypeType[];
    problems: IProblemType[];
    canBeCompeted: boolean;
    canBePracticed: boolean;
    resultsArePubliclyVisible: boolean;
    hasContestPassword: boolean;
    hasPracticePassword: boolean;
    userIsAdminOrLecturerInContest: boolean;
    userCanCompete: boolean;
    userIsParticipant: false;
    isActive: boolean;
    contestIsLoading: boolean;
    registerForContestLoading: boolean;
    submitContestPasswordIsLoading: boolean;
    getParticipantScoresIsLoading: boolean;
    duration: number;
    numberOfProblems: number;
}

interface IIndexContestsType {
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

interface IContestModal {
    id: number;
    name: string;
    duration: number;
    numberOfProblems: number;
}

interface IGetContestsForIndexResponseType {
    activeContests: IIndexContestsType[];
    pastContests: IIndexContestsType[];
}

interface IRegisterForContestResponseType {
    id: number;
    name: string;
    requirePassword: boolean;
    participantId: number| null;
    isOnlineExam: boolean;
    duration: number;
    numberOfProblems: number;
}

interface IStartParticipationResponseType {
    contest: IContestType;
    participantId: number;
    contestIsCompete: boolean;
    lastSubmissionTime: Date;
    endDateTimeForParticipantOrContest: Date | null;
    userSubmissionsTimeLimit: number;
    participantsCount: number;
}

interface IPagedResultType<TItem> {
    totalItemsCount: number;
    itemsPerPage: number;
    pagesCount: number;
    pageNumber: number;
    items?: TItem[];
}

interface IPage {
    page: number;
}

interface IUserType {
    id: string;
    username: string;
    email: string;
    permissions: IUserPermissionsType;
    isInRole: boolean;
}

interface IUserRoleType {
    id: string;
    name: string;
}

interface IUserResponseType {
    id: string;
    userName: string;
    email: string;
    roles: IUserRoleType[];
}

interface IUserPermissionsType {
    canAccessAdministration: boolean;
}

interface ISearchResponseModel {
    contests: IContestSearchType[];
    problems: IProblemSearchType[];
    users: IUserSearchType[];
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
    ISubmissionResponseModel,
    ISubmissionTypeType,
    IPagedResultType,
    IUserType,
    IPage,
    IUserResponseType,
    IUserPermissionsType,
    ISearchResponseModel,
    IContestModal,
    IContestDetailsResponseType,
    IContestDetailsProblemType,
};
