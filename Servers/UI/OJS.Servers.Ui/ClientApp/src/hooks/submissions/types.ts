import { ISubmissionTypeType, IUserProfileType } from '../../common/types';

interface IProblemType {
    id: number;
    name: string;
    maximumPoints: number;
    orderBy: number;
    contestId:number;
}

interface ITestRunType {
    id: number;
    timeUsed: number;
    memoryUsed: number;
    executionComment: string;
    checkerComment: string;
    resultType: string;
    expectedOutputFragment: string;
    userOutputFragment: string;
    orderBy: number;
    input: string;
    isTrialTest: boolean;
    showInput: boolean;
    testId: number;
}

interface ISubmissionType {
    id: number;
    submittedOn: Date;
    content: string;
    problem: IProblemType;
    submissionTypeName: string;
    submissionType: ISubmissionTypeType;
    points: number;
    testRuns: ITestRunType[];
    maxUsedTime: number;
    maxUsedMemory: number;
    isOfficial: boolean;
    isCompiledSuccessfully: boolean;
    isProcessed: boolean;
    compilerComment: string;
    createdOn: Date;
    modifiedOn?: Date;
    startedExecutionOn?: Date;
    processingComment: string;
    completedExecutionOn?: Date;
    contestId:number;
    memoryLimit: number;
    user: IUserProfileType;
    isEligibleForRetest: boolean;
}

interface ITestRunDetailsType extends ITestRunType {
    isTrialTest: boolean;
    input: string;
    showInput: boolean;
    testId: number;
}

interface ISubmissionDetailsType extends ISubmissionType {
    testRuns: ITestRunDetailsType[];
    user: IUserProfileType;
    userIsInRoleForContest: boolean;
    isEligibleForRetest: boolean;
    totalTests : number;
}

interface ISubmissionDetailsResponseType {
    id: number;
    problem: IProblemType;
    points: number;
    content: string;
    testRuns: ITestRunType[];
    user: IUserProfileType;
    userIsInRoleForContest: boolean;
    submissionType: ISubmissionTypeType;
    maxUsedTime: number;
    maxUsedMemory: number;
    isOfficial: boolean;
    isCompiledSuccessfully: boolean;
    isEligibleForRetest: boolean;
    compilerComment: string | null;
    isProcessed: boolean;
    createdOn: Date;
    modifiedOn: Date;
    startedExecutionOn: Date;
    completedExecutionOn: Date;
    workerName: string | null;
    processingComment: string | null;
    totalTests: number;
    contestId: number;
    contestName: string | null;
    contestCategoryId: number;
    maxPoints: number;
}

interface ISubmissionResults {
    id: number;
    problemId: number;
    submissionType: string;
    points: number;
    maximumPoints: number;
    createdOn: Date;
    content: string;
    isProcessed: boolean;
    isCompiledSuccessfully: boolean;
    isOfficial: boolean;
    compilerComment: string;
    testRuns: ITestRunDetailsType[];
    maxMemoryUsed: number;
    maxTimeUsed: number;
    testRunsCount: number;
}

interface ITestCaseRun {
    id: number;
    checkerComment?: string;
    executionComment?: string;
    expectedOutputFragment?: string;
    input?: string;
    isTrialTest: boolean;
    memoryUsed: number;
    orderBy: number;
    resultType: string;
    showInput: boolean;
    submissionId?: number;
    timeUsed: number;
    userOutputFragment?: string;
    testId: number;
}

interface ITestRunDetailsCollapsed {
    [id: string]: {
        isExpanded: boolean;
        detailsExpanded: boolean;
    };
}

interface ISubmissionResultsDetails {
    testRuns?: ITestCaseRun[];
}

interface IUserRole {
    id: string;
    name: string;
}

interface IUserAuthData {
    email: string;
    id: string;
    roles: IUserRole[];
    userName: string;
}

interface ITestRun {
    id: number;
    timeUsed: number;
    memoryUsed: number;
    submissionId: number;
    executionComment: string;
    checkerComment: string;
    resultType: string;
    expectedOutputFragment: string;
    userOutputFragment: string;
    isTrialTest: boolean;
    input: string;
    orderBy: number;
    showInput: boolean;
    testId: number;
}

export type {
    IProblemType,
    ITestRunType,
    ISubmissionType,
    ITestRunDetailsType,
    ISubmissionDetailsType,
    ISubmissionResults,
    ITestRunDetailsCollapsed,
    ISubmissionResultsDetails,
    ISubmissionDetailsResponseType,
    IUserAuthData,
    ITestCaseRun,
    IUserRole,
    ITestRun,
};
