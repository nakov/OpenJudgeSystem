import React from 'react';

import { ISubmissionDetailsType, ISubmissionResults, ITestRunType } from '../hooks/submissions/types';
import { IErrorDataType } from '../hooks/use-http';
import { IAdministrationFilter } from '../pages/administration-new/administration-filters/AdministrationFilters';
import { IAdministrationSorter } from '../pages/administration-new/administration-sorting/AdministrationSorting';

import { ContestVariation } from './contest-types';
import { FilterColumnTypeEnum, PublicSubmissionState } from './enums';
import { SearchCategory } from './search-types';

interface ISubmissionTypeType {
    id: number;
    name: string;
    isSelectedByDefault: boolean;
    allowBinaryFilesUpload: boolean;
    allowedFileExtensions: string[];
}
interface ISubmissionTypeInProblem {
    id: number;
    name: string;
}
interface IPublicSubmissionContest {
    id: number;
    name: string;
}

interface IPublicSubmissionUser {
    id: string;
    username: string;
}

interface ISubmissionDetailsState {
    currentSubmission: ISubmissionDetailsType | null;
    currentSubmissionResults:IPagedResultType<ISubmissionResults>;
    validationErrors: IErrorDataType[];
    downloadErrorMessage: string | null;
}
interface ISubmissionDetailsReduxState extends ISubmissionDetailsState {
    currentPage: number;
    retestIsSuccess: false;
}

interface IRecentSubmissionsReduxState {
    latestSubmissions: IPagedResultType<IPublicSubmission>;
    currentPage: number;
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

interface IPublicSubmission {
    id: number;
    createdOn: Date;
    strategyName: string;
    user?: IPublicSubmissionUser;
    problem: IPublicSubmissionProblem;
    result: IPublicSubmissionResult;
    state: PublicSubmissionState;
    isOfficial: boolean;
    isCompiledSuccessfully: boolean;
    maxMemoryUsed: number;
    maxTimeUsed: number;
    testRuns: ITestRunType[];
    processed: boolean;
}

interface ITestRunInListModel {
    id: number;
    timeUsed: number;
    memoryUsed: number;
    submissionId: number;
    executionComment: string;
    checkerComment: string;
    resultType: string;
}

interface IGetAllAdminParams {
    filter?: string;
    itemsPerPage: number;
    page: number;
    sorting?: string;
}

interface IGetAllContestsOptions {
    strategy?: number;
    sortType: string;
    page: number;
    category?: number | null;
}

interface IAllowedStrategyType {
    id: number;
    name: string;
}

interface IContestCategory {
    allowedStrategyTypes: Array<IAllowedStrategyType>;
    children: Array<IContestCategory>;
    id: number;
    name: string;
    nameUrl: string;
    orderBy: number;
    parentId: null | number;
}

interface IProblemResourceType {
    id: number;
    name: string;
    link: string;
    type: number;
}

interface IProblemResourceAdministrationModel {
    id: number;
    name: string;
    link: string;
    type: string;
    orderBy: number;
    file: File | null;
    hasFile: boolean;
    problemId: number;
}

interface IProblemResouceInLinstModel {
    id: number;
    name: string;
    link: string;
    type: string;
    fileExtension: string;
    orderBy: number;
    isDeleted: boolean;
    problemId: number;
    problemName: string;
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
    problems: IProblemType[];
    canViewResults: boolean;
    isOnlineExam: boolean;
    canBeCompeted: boolean;
    canBePracticed: boolean;
    isAdminOrLecturerInContest: boolean;
    allowedSubmissionTypes: IContestDetailsSubmissionType[];
    competeParticipantsCount: number;
    practiceParticipantsCount: number;
    categoryId: number;
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
    numberOfProblems: number;
    practiceResults: number;
    competeResults: number;
    hasCompeted: boolean;
    hasPracticed: boolean;
    competeContestPoints: number;
    practiceContestPoints: number;
    maxPoints: number;
}

interface IContestModalInfoType {
    id: number;
    name: string;
    duration: number;
    numberOfProblems: number;
}

interface IGetContestsForIndexResponseType {
    activeContests: IIndexContestsType[];
    pastContests: IIndexContestsType[];
}
interface IIndexProblemsType {
    id: number;
    name: string;
    problemGroupId: number;
    groupType: string;
    contest: string;
    practiceTestsCount: number;
    competeTetstsCount: number;
    isDeleted: boolean;
    contestId: number;
}

interface IIndexContestCategoriesType {
    id: number;
    name: string;
    parent: string;
    parentId: number;
    isDeleted: boolean;
    isVisible: boolean;
    orderBy: number;
    modifiedOn: Date;
    createdOn: Date;
    deletedOn: Date;
}

interface IContestCategoryAdministration {
    id: number;
    name: string;
    parent: string | null;
    parentId: number | null;
    isDeleted: boolean;
    isVisible: boolean;
    orderBy: number;
    deletedOn: Date | null;
    modifiedOn: Date | null;
}

interface IRegisterForContestResponseType {
    id: number;
    name: string;
    requirePassword: boolean;
    participantId: number| null;
    isOnlineExam: boolean;
    duration: number;
    numberOfProblems: number;
    categoryId: number;
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

interface IAdminPagedResultType<TItem> {
    items?: TItem[];
    page: number;
    itemsPerPage: number;
    totalCount: number;
    totalPages: number;
}

interface IAdminContestResponseType {
    id: number;
    category: string;
    name: string;
    allowParallelSubmissionsInTasks: boolean;
    categoryId: number;
    startTime: string;
    endTime: string;
    contestPassword: string;
    description: string;
    isDeleted: boolean;
    isVisible: boolean;
    limitBetweenSubmissions: number;
}

interface IPage {
    page: number;
}

interface IUserType {
    id: string;
    userName: string;
    email: string;
    permissions: IUserPermissionsType;
    isInRole: boolean;
    isAdmin: boolean;
    canAccessAdministration: boolean;
}

interface IProblemAdministration {
    id: number | undefined;
    name: string;
    maximumPoints: number;
    sourceCodeSizeLimit: number;
    orderBy: number;
    showResults: boolean;
    showDetailedFeedback: boolean;
    checkerId: string;
    problemGroupType: string;
    contestId: number;
    submissionTypes: Array<IProblemSubmissionType>;
    timeLimit: number;
    memoryLimit: number;
    contestType: ContestVariation;
    tests: File | null;
    problemGroupOrderBy: number;
    problemGroupId : number;
}

interface ISubmissionTypesInListModel{
    id: number;
    name: string;
    executionStrategyType: string;
    compilerType: string;
    allowBinaryFilesUpload: boolean;
    allowedFileExtensions: string;
}

interface IProblemGroupDropdownModel {
    id: number;
    orderBy: number;
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

interface ISearchProps<T> {
    searchTerm : string;
    searchCategory : SearchCategory;
    renderItem: (item: T) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

interface IContestAdministration {
    id: number;
    name: string;
    type: string;
    categoryId: number;
    categoryName: string;
    description: string | null;
    startTime: Date | null;
    endTime: Date | null;
    practiceStartTime: Date | null;
    practiceEndTime: Date | null;
    contestPassword: string | null;
    practicePassword: string | null;
    limitBetweenSubmissions: number;
    isVisible: boolean;
    newIpPassword: string | null;
    allowParallelSubmissionsInTasks: boolean;
    orderBy: number;
    allowedIps: string;
    numberOfProblemGroups: number;
    duration: string | undefined;
}

interface ISubmissionsAdminGridViewType {
    id: number;
    isCompiledSuccessfully: boolean;
    processed: boolean;
    isDeleted: boolean;
    isBinaryFile: boolean;
    processingComment: boolean;
    points: number;
    participant: IParticipantType;
    problem: IProblemSimpleType;
    submissionType: ISubmissionTypeSimpleType;
    createdOn: Date;
    modifiedOn: Date;
    startedExecutionOn: Date;
    completedExecutionOn: Date;
}

interface ISubmissionForProcessingAdminGridViewType {
    id: number;
    processed: boolean;
    processing: boolean;
    serializedException: string;
    serializedExecutionDetails: string;
    serializedExecutionResult: string;
    submissionId: number;
    createdOn: Date;
    modifiedOn: Date;
}

interface IParticipantType {
    id: number;
    username: string;
}

interface IProblemSimpleType {
    id: number;
    name: string;
}

interface ISubmissionTypeSimpleType {
    id: number;
    name: string;
}

interface IContestAutocomplete {
    id: number;
    name: string;
}

interface ITestsUploadModel {
    problemId: number;
    tests: File | null;
    retestProblem: boolean;
    deleteOldTests: boolean;
}
interface ITestsDropdownData {
    id: number;
    name: string;
}

interface IFileModel {
    blob: Blob;
    filename: string;
}
interface IContestCategories {
    id: number;
    name: string;
}

interface IEnumType {
    enumValues?: Array<string>;
}

interface IFilterReducerActionType {
    key: string;
    filters: Array<IAdministrationFilter> | null;
}

interface ISorterReducerActionType {
    key: string;
    sorters: Array<IAdministrationSorter> | null;
}

interface IFilterColumn {
    columnName: string;
    columnType: FilterColumnTypeEnum;
    enumValues?: Array<string> | null;
}

interface IAdminSlice {
    [key: string]: null | {
        selectedFilters: IAdministrationFilter[] | null;
        selectedSorters: IAdministrationSorter[] | null;
    };
}

interface IRootStore {
    adminContests: IAdminSlice;
    adminSubmissions: IAdminSlice;
    adminProblems: IAdminSlice;
    adminTests: IAdminSlice;
    adminProblemGroups: IAdminSlice;
    adminContestsCategories: IAdminSlice;
    adminProblemResources: IAdminSlice;
    adminSubmissionTypes: IAdminSlice;
    adminCheckers: IAdminSlice;
    adminParticipants: IAdminSlice;
}
type ExceptionData = {
    name: string;
    message: string;
}

interface IProblemGroupsData {
    id:number;
    contest:string;
    isDeleted:boolean;
    orderBy:number;
    type:string;
}
interface IProblemSubmissionType{
    id: number;
    name: string;
    solutionSkeleton: string | null;
}

interface ISubmissionTypeAdministrationModel {
    id: number;
    name: string;
    executionStrategyType: string;
    compilerType: string;
    additionalCompilerArguments: string;
    description: string;
    allowedFileExtensions: string;
    isSelectedByDefault: boolean;
    allowBinaryFilesUpload: boolean;
}

interface ICheckerInListModel {
    id: number;
    name: string;
    dllFile: string;
    className: string;
    parameter: string;
    isDeleted: boolean;
}

interface ICheckerAdministrationModel {
    id: number;
    name: string;
    dllFile: string | null;
    className: string | null;
    parameter: string | null;
    description: string | null;
}

interface IParticipantInListModel {
    id: number;
    userName: string;
    contestName: string;
    contestId: number;
    isOfficial: boolean;
}

interface IParticipantAdministrationModel {
    id: number;
    userName: string;
    contestId: number;
    contestName: string;
    userId: string;
    isOfficial: boolean;
}

interface IUserAutocompleteData {
id: string;
userName: string;

}
// eslint-disable-next-line import/prefer-default-export
export type {
    IIndexContestsType,
    ISearchProps,
    IGetContestsForIndexResponseType,
    IRegisterForContestResponseType,
    IStartParticipationResponseType,
    IContestType,
    IProblemType,
    IProblemResourceType,
    IRecentSubmissionsReduxState,
    IPublicSubmission,
    ISubmissionTypeType,
    IPagedResultType,
    IUserType,
    IPage,
    IUserResponseType,
    IUserPermissionsType,
    IContestModalInfoType,
    IContestDetailsResponseType,
    IContestDetailsProblemType,
    ISubmissionDetailsState,
    ISubmissionDetailsReduxState,
    IGetAllContestsOptions,
    IContestCategory,
    IGetAllAdminParams,
    IAdminPagedResultType,
    IAdminContestResponseType,
    IContestAdministration,
    IFilterColumn,
    ISubmissionsAdminGridViewType,
    ISubmissionForProcessingAdminGridViewType,
    IAdminSlice,
    IRootStore,
    IContestCategories,
    ExceptionData,
    IIndexProblemsType,
    IProblemAdministration,
    IProblemSubmissionType,
    ISubmissionTypeInProblem,
    IContestAutocomplete,
    IProblemGroupsData,
    IIndexContestCategoriesType,
    IContestCategoryAdministration,
    ITestsDropdownData,
    IProblemResouceInLinstModel,
    IProblemResourceAdministrationModel,
    ITestsUploadModel,
    IFileModel,
    IEnumType,
    ISubmissionTypesInListModel,
    ISubmissionTypeAdministrationModel,
    ITestRunInListModel,
    ISorterReducerActionType,
    IFilterReducerActionType,
    IProblemGroupDropdownModel,
    ICheckerInListModel,
    ICheckerAdministrationModel,
    IParticipantAdministrationModel,
    IParticipantInListModel,
    IUserAutocompleteData,
};
