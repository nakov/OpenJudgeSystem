import { ISubmissionTypeType } from '../../common/types';
import { IUserProfileType } from '../use-users';

interface IProblemType {
    id: number;
    name: string;
    maximumPoints: number;
    orderBy: number;
    contestId:number;
}

interface ISubmissionDetailsWithResults {
    submissionDetails: ISubmissionDetailsType;
    submissionResults:ISubmissionDetails[];
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
    totalTests : number;
}

interface ISubmissionDetails {
    id: number;
    problemId: number;
    createdOn: Date;
    content: string;
    points: number;
    maximumPoints: number;
    isProcessed: boolean;
    isCompiledSuccessfully: boolean;
    isOfficial: boolean;
    submissionType: string;
    compilerComment: string;
    testRuns: ITestRunDetailsType[];
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

export type {
    IProblemType,
    ITestRunType,
    ISubmissionType,
    ITestRunDetailsType,
    ISubmissionDetailsType,
    ISubmissionDetails,
    ITestRunDetailsCollapsed,
    ISubmissionResultsDetails,
    IUserAuthData,
    ITestCaseRun,
    IUserRole,
    ISubmissionDetailsWithResults,
};
